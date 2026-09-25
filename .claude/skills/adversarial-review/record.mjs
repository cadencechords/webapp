#!/usr/bin/env node
// Records the outcome of an adversarial review for the current commit, so the
// require-adversarial-review hook lets a PR for exactly this commit be opened.
//
//   node .claude/skills/adversarial-review/record.mjs <pass|fail> <summary.json>
//
// The summary is the JSON described in SKILL.md. Records live in
// <git-common-dir>/adversarial-reviews/<sha>.json: local to this clone, never
// committed, and tied to one commit, so any later commit needs a new review.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const fail = message => {
  console.error(`record: ${message}`);
  process.exit(1);
};

const [verdict, summaryFile] = process.argv.slice(2);
if (!['pass', 'fail'].includes(verdict) || !summaryFile) {
  fail('usage: record.mjs <pass|fail> <summary.json>');
}

// The review must cover exactly what the PR will contain.
if (git('status', '--porcelain')) {
  fail('working tree has uncommitted changes; commit them and review again');
}
const sha = git('rev-parse', 'HEAD');
const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
let pushed = '';
try {
  pushed = git('rev-parse', `origin/${branch}`);
} catch {
  fail(`origin/${branch} doesn't exist; push the branch first`);
}
if (pushed !== sha) {
  fail(
    `origin/${branch} (${pushed.slice(0, 7)}) isn't HEAD (${sha.slice(0, 7)}); push first`
  );
}

const summary = JSON.parse(readFileSync(summaryFile, 'utf8'));
for (const key of ['base', 'lenses', 'findings', 'checks']) {
  if (!(key in summary)) fail(`summary is missing "${key}"`);
}
const openBlocking = summary.findings.filter(
  f =>
    f.verdict === 'confirmed' &&
    ['blocker', 'major'].includes(f.severity) &&
    f.resolution !== 'fixed'
);
if (verdict === 'pass' && openBlocking.length) {
  fail(
    `can't pass with ${openBlocking.length} confirmed blocker/major finding(s) not fixed`
  );
}
const failedChecks = Object.entries(summary.checks).filter(
  ([, result]) => result !== 'pass'
);
if (verdict === 'pass' && failedChecks.length) {
  fail(
    `can't pass with failing checks: ${failedChecks.map(([name]) => name).join(', ')}`
  );
}

const dir = path.join(
  git('rev-parse', '--git-common-dir'),
  'adversarial-reviews'
);
mkdirSync(dir, { recursive: true });
const file = path.join(dir, `${sha}.json`);
writeFileSync(
  file,
  JSON.stringify(
    { sha, branch, verdict, recordedAt: new Date().toISOString(), ...summary },
    null,
    2
  ) + '\n'
);
console.log(
  `Recorded "${verdict}" review for ${sha.slice(0, 7)} (${branch}) in ${file}`
);
