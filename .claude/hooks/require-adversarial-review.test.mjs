// Tests for the adversarial review gate: the PreToolUse hook (through its
// fail-closed wrapper) and record.mjs. Each test gets its own throwaway repo and
// remote, so the real repo and its review records are never touched.
// Run: yarn test:hooks
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const wrapper = path.join(here, 'run-hook.sh');
const recorder = path.resolve(here, '../skills/adversarial-review/record.mjs');
const GH = 'gh';
const CREATE = [GH, 'pr', 'create'].join(' '); // spelled out so this file's own tooling never trips the hook

// A repo cloned from a bare "acme/app" remote, with main and feat pushed.
function fixture(t) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'review-gate-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const origin = path.join(root, 'acme', 'app.git');
  const work = path.join(root, 'work');
  const git = (cwd, ...args) =>
    execFileSync(
      'git',
      [
        '-c',
        'user.name=t',
        '-c',
        'user.email=t@t',
        '-c',
        'init.defaultBranch=main',
        ...args,
      ],
      {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    ).trim();
  mkdirSync(origin, { recursive: true });
  git(origin, 'init', '--bare', '--quiet');
  git(root, 'clone', '--quiet', origin, work);
  const commit = message => {
    writeFileSync(path.join(work, 'file.txt'), message);
    git(work, 'add', '.');
    git(work, 'commit', '--quiet', '-m', message);
    return git(work, 'rev-parse', 'HEAD');
  };
  commit('initial');
  git(work, 'push', '--quiet', '-u', 'origin', 'main');
  git(work, 'checkout', '--quiet', '-b', 'feat');
  const feat = commit('feature');
  git(work, 'push', '--quiet', '-u', 'origin', 'feat');
  const records = path.join(work, '.git', 'adversarial-reviews');
  const record = (sha, body) => {
    mkdirSync(records, { recursive: true });
    writeFileSync(
      path.join(records, `${sha}.json`),
      typeof body === 'string'
        ? body
        : JSON.stringify({ sha, verdict: 'pass', ...body })
    );
  };
  return { root, work, git: (...a) => git(work, ...a), commit, feat, record };
}

function hook(fx, payload, raw) {
  const input = raw ?? JSON.stringify({ cwd: fx.work, ...payload });
  const r = spawnSync('sh', [wrapper], {
    cwd: fx.work,
    input,
    encoding: 'utf8',
  });
  return { code: r.status, stderr: r.stderr };
}
const bash = (fx, command) =>
  hook(fx, { tool_name: 'Bash', tool_input: { command } });
const mcp = (fx, input, tool = 'mcp__github__create_pull_request') =>
  hook(fx, {
    tool_name: tool,
    tool_input: {
      owner: 'acme',
      repo: 'app',
      base: 'main',
      title: 't',
      ...input,
    },
  });

test('lets through tools and commands that do not open a PR', t => {
  const fx = fixture(t);
  assert.equal(
    hook(fx, { tool_name: 'Read', tool_input: { file_path: 'x' } }).code,
    0
  );
  for (const command of [
    'ls -la',
    `${GH} pr list`,
    `${GH} pr view 4`,
    `${CREATE} --help`,
    `git commit -m "don't forget ${CREATE} --head other"`,
    `echo '${CREATE}'`,
    `cat > x.md <<'EOF'\nrun \`${CREATE} --head other\`\nEOF\necho done`,
    `${GH} api repos/acme/app/pulls`,
  ]) {
    assert.equal(bash(fx, command).code, 0, command);
  }
});

test('blocks every way of opening a PR when there is no review', t => {
  const fx = fixture(t);
  for (const command of [
    CREATE,
    `${CREATE} --head feat`,
    `${CREATE} --head=feat`,
    `${CREATE} -H feat`,
    `${GH} pr new --title t`,
    `/usr/local/bin/${CREATE}`,
    `GH_TOKEN=x ${CREATE}`,
    `env ${CREATE}`,
    `time ${CREATE}`,
    `sh -c "${CREATE} --title t"`,
    `bash -c '${CREATE}'`,
    `echo "$(${CREATE})"`,
    `echo \`${CREATE}\``,
    `${GH} -R acme/app pr create`,
    `git commit -m "don't stop" && ${CREATE} --title 'x'`,
    `${CREATE} --title t --body "$(cat <<'EOF'\nbody\nEOF\n)"`,
  ]) {
    const r = bash(fx, command);
    assert.equal(r.code, 2, command);
    assert.match(r.stderr, /no adversarial review recorded/, command);
  }
  assert.match(
    mcp(fx, { head: 'feat' }).stderr,
    /no adversarial review recorded/
  );
});

test('allows a PR whose head commit passed review', t => {
  const fx = fixture(t);
  fx.record(fx.feat);
  assert.equal(mcp(fx, { head: 'feat' }).code, 0);
  assert.equal(mcp(fx, { head: 'acme:feat' }).code, 0);
  assert.equal(bash(fx, CREATE).code, 0); // current branch
  assert.equal(bash(fx, `${CREATE} -H feat --title "don't"`).code, 0);
  assert.equal(bash(fx, `cd /tmp && ${CREATE} --head feat`).code, 0);
});

test('checks the branch the PR is really for', t => {
  const fx = fixture(t);
  fx.record(fx.feat); // feat is reviewed, main isn't
  assert.equal(bash(fx, `${CREATE} -H main`).code, 2);
  assert.equal(
    bash(fx, `${CREATE} --title t --body "stacked on --head feat"`).code,
    0
  );
  fx.git('checkout', '--quiet', 'main');
  assert.equal(
    bash(fx, `${CREATE} --title t --body "stacked on --head feat"`).code,
    2
  );
  assert.equal(bash(fx, `${CREATE} -H feat`).code, 0);
});

test('blocks when the head branch cannot be known', t => {
  const fx = fixture(t);
  fx.record(fx.feat);
  assert.match(
    bash(fx, `cd ../other && ${CREATE}`).stderr,
    /head branch is unknown/
  );
  assert.match(
    bash(fx, `git checkout main && ${CREATE}`).stderr,
    /head branch is unknown/
  );
  fx.git('checkout', '--quiet', '--detach');
  assert.match(bash(fx, CREATE).stderr, /detached/);
});

test('blocks PRs for other repos, forks and unsupported tools, even with a review', t => {
  const fx = fixture(t);
  fx.record(fx.feat);
  assert.match(
    mcp(fx, { head: 'feat', owner: 'evil' }).stderr,
    /targets evil\/app/
  );
  assert.match(mcp(fx, { head: 'someone:feat' }).stderr, /fork/);
  assert.match(
    bash(fx, `${CREATE} -R evil/other -H feat`).stderr,
    /targets evil\/other/
  );
  assert.match(
    mcp(fx, { head: 'feat' }, 'mcp__github__create_pull_request_with_copilot')
      .stderr,
    /can't be checked/
  );
  assert.match(
    bash(fx, `${GH} api -X POST repos/acme/app/pulls -f head=feat`).stderr,
    /gh api/
  );
  assert.match(
    bash(fx, `${GH} api repos/acme/app/pulls -f head=feat -f base=main`).stderr,
    /gh api/
  );
});

test('uses the pushed head, not a stale local ref', t => {
  const fx = fixture(t);
  fx.record(fx.feat);
  // Someone else pushes a new commit to feat; the local origin/feat is stale.
  const other = path.join(fx.root, 'other');
  execFileSync('git', [
    'clone',
    '--quiet',
    '-b',
    'feat',
    path.join(fx.root, 'acme', 'app.git'),
    other,
  ]);
  writeFileSync(path.join(other, 'file.txt'), 'unreviewed');
  execFileSync(
    'git',
    [
      '-c',
      'user.name=t',
      '-c',
      'user.email=t@t',
      'commit',
      '--quiet',
      '-am',
      'unreviewed',
    ],
    { cwd: other }
  );
  execFileSync('git', ['push', '--quiet'], { cwd: other });
  assert.match(
    mcp(fx, { head: 'feat' }).stderr,
    /no adversarial review recorded for feat @/
  );
  assert.match(bash(fx, `${CREATE} -H not-pushed`).stderr, /couldn't fetch/);
});

test('fails closed on bad records, bad input and crashes', t => {
  const fx = fixture(t);
  fx.record(fx.feat, { verdict: 'fail' });
  assert.match(mcp(fx, { head: 'feat' }).stderr, /did not pass/);
  fx.record(fx.feat, '{"verdict":');
  assert.match(mcp(fx, { head: 'feat' }).stderr, /unreadable/);
  fx.record(fx.feat, JSON.stringify({ verdict: 'pass' })); // no sha: not written by record.mjs
  assert.equal(mcp(fx, { head: 'feat' }).code, 2);
  assert.equal(hook(fx, null, '{not json').code, 2);
  assert.equal(bash(fx, `${CREATE} --title "unterminated`).code, 2);
  // A PATH with the shell tools the wrapper uses, but no node.
  const bin = path.join(fx.root, 'bin');
  mkdirSync(bin);
  for (const tool of ['sh', 'cat', 'dirname']) {
    const real = execFileSync('sh', ['-c', `command -v ${tool}`], {
      encoding: 'utf8',
    }).trim();
    symlinkSync(real, path.join(bin, tool));
  }
  const noNode = spawnSync(path.join(bin, 'sh'), [wrapper], {
    input: JSON.stringify({
      cwd: fx.work,
      tool_name: 'Bash',
      tool_input: { command: CREATE },
    }),
    env: { PATH: bin },
    encoding: 'utf8',
  });
  assert.equal(noNode.status, 2);
  assert.match(noNode.stderr, /is node on PATH/);
});

// ---------------------------------------------------------------- record.mjs

function record(fx, verdict, summary, checks = { ok: 'true' }) {
  const file = path.join(fx.root, 'summary.json');
  writeFileSync(file, JSON.stringify(summary));
  const r = spawnSync('node', [recorder, verdict, file], {
    cwd: fx.work,
    encoding: 'utf8',
    env: { ...process.env, ADVERSARIAL_REVIEW_CHECKS: JSON.stringify(checks) },
  });
  return { code: r.status, out: r.stdout + r.stderr };
}
const good = { base: 'main', lenses: ['correctness', 'tests'], findings: [] };

test('record.mjs records a passing review that unlocks the PR', t => {
  const fx = fixture(t);
  const r = record(fx, 'pass', good);
  assert.equal(r.code, 0, r.out);
  assert.equal(mcp(fx, { head: 'feat' }).code, 0);
});

test('record.mjs refuses a review that does not cover the pushed commit', t => {
  const fx = fixture(t);
  writeFileSync(path.join(fx.work, 'file.txt'), 'dirty');
  assert.match(record(fx, 'pass', good).out, /uncommitted changes/);
  fx.git('checkout', '--quiet', '--', 'file.txt');
  writeFileSync(path.join(fx.work, 'untracked.txt'), 'x'); // not part of the PR: fine
  fx.commit('local only');
  assert.match(record(fx, 'pass', good).out, /push first/);
});

test('record.mjs refuses an incomplete or unresolved review', t => {
  const fx = fixture(t);
  const cases = [
    [{ ...good, lenses: ['correctness'] }, /at least two/],
    [{ ...good, findings: 'none' }, /must be an array/],
    [{ ...good, base: '' }, /base/],
    [
      {
        ...good,
        findings: [
          { severity: 'Major', verdict: 'Confirmed', resolution: 'follow-up' },
        ],
      },
      /not fixed/,
    ],
    [
      { ...good, findings: [{ severity: 'blocker', verdict: 'unverified' }] },
      /must be verified/,
    ],
    [
      { ...good, findings: [{ severity: 'huge', verdict: 'confirmed' }] },
      /severity/,
    ],
  ];
  for (const [summary, error] of cases)
    assert.match(record(fx, 'pass', summary).out, error);
  assert.match(
    record(fx, 'pass', good, { ok: 'true', broken: 'false' }).out,
    /failing checks: broken/
  );
  assert.equal(mcp(fx, { head: 'feat' }).code, 2); // nothing was recorded
  const fixed = {
    ...good,
    findings: [
      { severity: 'major', verdict: 'confirmed', resolution: 'fixed' },
    ],
  };
  assert.equal(record(fx, 'pass', fixed).code, 0);
});
