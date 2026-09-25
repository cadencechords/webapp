// Tests for the require-adversarial-review hook. Run: yarn test:hooks
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { after, afterEach, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const hook = fileURLToPath(
  new URL('./require-adversarial-review.mjs', import.meta.url)
);
const cwd = path.resolve(path.dirname(hook), '../..');
const git = (...a) => execFileSync('git', a, { cwd, encoding: 'utf8' }).trim();
const tryGit = (...a) => {
  try {
    return git(...a);
  } catch {
    return null;
  }
};

// A throwaway local branch at HEAD, so the tests work anywhere (including
// CI's detached checkout) and never depend on what's been pushed.
const branch = `adversarial-review-test-${process.pid}`;
git('branch', '--force', branch, 'HEAD');
const sha = git('rev-parse', 'HEAD');
const dir = path.resolve(
  cwd,
  git('rev-parse', '--git-common-dir'),
  'adversarial-reviews'
);
const record = path.join(dir, `${sha}.json`);
const GH = ['gh', 'pr', 'create'].join(' '); // keep the literal out of this file's own commands

function run(payload) {
  const r = spawnSync('node', [hook], {
    cwd,
    input: JSON.stringify({ cwd, ...payload }),
    encoding: 'utf8',
  });
  return { code: r.status, stderr: r.stderr };
}
const mcp = head =>
  run({
    tool_name: 'mcp__github__create_pull_request',
    tool_input: { head, base: 'master' },
  });
const bash = command => run({ tool_name: 'Bash', tool_input: { command } });
const withRecord = verdict => {
  mkdirSync(dir, { recursive: true });
  writeFileSync(record, JSON.stringify({ verdict }));
};

afterEach(() => rmSync(record, { force: true }));
after(() => git('branch', '-D', branch));

test('ignores tools and commands that do not open a PR', () => {
  assert.equal(run({ tool_name: 'Read', tool_input: {} }).code, 0);
  assert.equal(bash('ls -la').code, 0);
  assert.equal(bash('gh pr list').code, 0);
});

test('ignores commands that only mention opening a PR', () => {
  assert.equal(
    bash(`cat > x.md <<'EOF'\nuse \`${GH}\` (with \`--head\`)\nEOF\necho ok`)
      .code,
    0
  );
  assert.equal(bash(`git commit -m "blocks ${GH} without review"`).code, 0);
  assert.equal(bash(`echo '${GH} --head x'`).code, 0);
});

test('blocks a PR with no review recorded', () => {
  const r = mcp(branch);
  assert.equal(r.code, 2);
  assert.match(r.stderr, /no adversarial review recorded/);
  assert.equal(bash(`cd /tmp && ${GH} --head ${branch} --title "a b"`).code, 2);
  assert.equal(bash(`/usr/local/bin/${GH} --title t --head=${branch}`).code, 2);
  assert.equal(bash(`${GH} --head "${branch}" --title t`).code, 2);
});

test('blocks a PR whose review did not pass', () => {
  withRecord('fail');
  assert.match(mcp(branch).stderr, /did not pass/);
});

test('blocks a PR for a branch that does not resolve', () => {
  assert.match(mcp('no/such-branch-xyz').stderr, /can't resolve/);
});

test('allows a PR whose head commit passed review', () => {
  withRecord('pass');
  assert.equal(mcp(branch).code, 0);
  assert.equal(mcp(`someone:${branch}`).code, 0); // owner:branch form
  assert.equal(bash(`${GH} --head=${branch}`).code, 0);
});
