#!/usr/bin/env node
// Records the outcome of an adversarial review for the current commit, so the
// require-adversarial-review hook lets a PR for exactly this commit be opened.
//
//   node .claude/skills/adversarial-review/record.mts <pass|fail> <summary.json>
//   node .claude/skills/adversarial-review/record.mts bypass "<reason>"
//
// It runs the repo's checks itself (the same ones as CI) rather than trusting
// a reported result, and validates the review summary described in SKILL.md.
// The summary's contents (what the reviewers found) are self-reported; the PR
// description's "Adversarial review" section is where humans can check them.
//
// `bypass` is only for when the user asks in chat to skip the review for this
// PR: it records their reason for the pushed commit and runs no review or checks.
//
// Records live in <git-common-dir>/adversarial-reviews/<sha>.json: local to
// this clone, never committed, and tied to one commit.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// The CI checks, as package.json scripts (so a repo's own definitions run).
const CHECKS = [
  'typecheck',
  'lint',
  'format:check',
  'test:unit',
  'test:hooks',
  'build',
];
// Fields record.mts sets itself; a summary can't supply them.
const RESERVED = ['sha', 'branch', 'verdict', 'recordedAt', 'checks'];
const SEVERITIES = ['blocker', 'major', 'minor'];
const VERDICTS = ['confirmed', 'refuted', 'unverified'];

const git = (...args: string[]) =>
  execFileSync('git', args, { encoding: 'utf8' }).trim();
const tryGit = (...args: string[]) => {
  try {
    return git(...args);
  } catch {
    return null;
  }
};
// Annotated so TypeScript knows code after a fail() call doesn't run.
const fail: (message: string) => never = message => {
  console.error(`record: ${message}`);
  process.exit(1);
};

const [verdict, summaryFile] = process.argv.slice(2);
if (!['pass', 'fail', 'bypass'].includes(verdict) || !summaryFile?.trim()) {
  fail(
    'usage: record.mts <pass|fail> <summary.json>, or record.mts bypass "<reason>"'
  );
}

// The review must cover exactly what the PR will contain. Untracked files
// aren't part of the PR, so they don't count as changes.
if (git('status', '--porcelain', '--untracked-files=no')) {
  fail('there are uncommitted changes; commit them and review again');
}
const sha = git('rev-parse', 'HEAD');
const branch = tryGit('symbolic-ref', '--quiet', '--short', 'HEAD');
if (!branch) fail('HEAD is detached; check out the PR branch');
const remote = tryGit('config', `branch.${branch}.remote`) || 'origin';
if (
  tryGit(
    'fetch',
    '--quiet',
    '--no-tags',
    remote,
    `+refs/heads/${branch}:refs/remotes/${remote}/${branch}`
  ) === null
) {
  fail(`couldn't fetch ${remote}/${branch}; push the branch first`);
}
const pushed = git('rev-parse', `refs/remotes/${remote}/${branch}`);
if (pushed !== sha) {
  fail(
    `${remote}/${branch} (${pushed.slice(0, 7)}) isn't HEAD (${sha.slice(0, 7)}); push first`
  );
}

const dir = path.resolve(
  git('rev-parse', '--git-common-dir'),
  'adversarial-reviews'
);
const file = path.join(dir, `${sha}.json`);
const save = (record: Record<string, unknown>) => {
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, JSON.stringify(record, null, 2) + '\n');
  console.log(
    `Recorded "${verdict}" review for ${sha.slice(0, 7)} (${branch}) in ${file}`
  );
};

// No review and no checks: only the user's reason, for this one commit.
if (verdict === 'bypass') {
  save({
    sha,
    branch,
    verdict,
    reason: summaryFile.trim(),
    recordedAt: new Date().toISOString(),
  });
  process.exit(0);
}

// A review summary as SKILL.md describes it. Nothing about it is trusted:
// each field is checked below.
type Finding = {
  severity?: unknown;
  verdict?: unknown;
  resolution?: unknown;
  [field: string]: unknown;
};
let summary: Record<string, unknown>;
try {
  summary = JSON.parse(readFileSync(summaryFile, 'utf8'));
} catch (error) {
  // readFileSync and JSON.parse only throw Errors.
  fail(`can't read the summary: ${(error as Error).message}`);
}
const reserved = RESERVED.filter(key => key in summary);
if (reserved.length)
  fail(
    `the summary can't set ${reserved.join(', ')}; record.mts sets those itself`
  );
if (typeof summary.base !== 'string' || !summary.base)
  fail('summary.base must name the PR base branch');
const lenses = Array.isArray(summary.lenses)
  ? [...new Set(summary.lenses.map(String))]
  : [];
if (lenses.length < 2)
  fail('summary.lenses must list at least two distinct review lenses');
if (summary.reviewers !== 1 && summary.reviewers !== 2)
  fail('summary.reviewers must say how many reviewer agents ran: 1 or 2');
if (!Array.isArray(summary.findings))
  fail('summary.findings must be an array (empty if nothing was found)');
const findings = summary.findings.map((f: Finding, i: number) => {
  const severity = String(f.severity || '').toLowerCase();
  const status = String(f.verdict || '').toLowerCase();
  if (!SEVERITIES.includes(severity))
    fail(`finding ${i + 1}: severity must be one of ${SEVERITIES.join(', ')}`);
  if (!VERDICTS.includes(status))
    fail(`finding ${i + 1}: verdict must be one of ${VERDICTS.join(', ')}`);
  if (severity !== 'minor' && status === 'unverified')
    fail(
      `finding ${i + 1}: blocker/major findings must be verified (confirmed or refuted)`
    );
  return {
    ...f,
    severity,
    verdict: status,
    resolution: String(f.resolution || '').toLowerCase(),
  };
});
const open = findings.filter(
  f =>
    f.verdict === 'confirmed' &&
    f.severity !== 'minor' &&
    f.resolution !== 'fixed'
);
if (verdict === 'pass' && open.length)
  fail(
    `can't pass with ${open.length} confirmed blocker/major finding(s) not fixed`
  );

// Run the checks here instead of trusting reported results.
const checks: Record<string, string> = {};
for (const name of CHECKS) {
  process.stdout.write(`check ${name}: `);
  const result = spawnSync('yarn', ['-s', name], { stdio: 'ignore' });
  checks[name] = result.status === 0 ? 'pass' : 'fail';
  console.log(checks[name]);
}
const failed = Object.keys(checks).filter(name => checks[name] !== 'pass');
if (verdict === 'pass' && failed.length)
  fail(`can't pass with failing checks: ${failed.join(', ')}`);
if (
  git('rev-parse', 'HEAD') !== sha ||
  git('status', '--porcelain', '--untracked-files=no')
) {
  fail(
    'the checks changed the working tree or HEAD; commit or discard that and review again'
  );
}

save({
  ...summary,
  lenses,
  findings,
  sha,
  branch,
  verdict,
  recordedAt: new Date().toISOString(),
  checks,
});
