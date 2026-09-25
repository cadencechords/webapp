#!/usr/bin/env node
// PreToolUse hook: blocks opening a pull request (GitHub MCP
// create_pull_request, or `gh pr create`) unless the PR's head commit has a
// passing adversarial review recorded by .claude/skills/adversarial-review.
// Exit 2 blocks the tool call and shows stderr to Claude.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const { tool_name: tool, tool_input: args = {} } = input;
const cwd = input.cwd || process.cwd();
const git = (...a) =>
  execFileSync('git', a, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
const tryGit = (...a) => {
  try {
    return git(...a);
  } catch {
    return null;
  }
};

let head = null;
if (/create_pull_request$/.test(tool || '')) {
  head = args.head;
} else if (tool === 'Bash' && /\bgh\s+pr\s+create\b/.test(args.command || '')) {
  head =
    (args.command.match(/--head(?:=|\s+)["']?([^\s"']+)/) || [])[1] ||
    tryGit('rev-parse', '--abbrev-ref', 'HEAD');
} else {
  process.exit(0); // not a PR creation
}
head = String(head || '').replace(/^[^:]+:/, ''); // "owner:branch" -> "branch"

// The PR contains what's on the remote branch; fall back to the local one.
const sha =
  tryGit('rev-parse', `origin/${head}`) ||
  tryGit('rev-parse', `refs/heads/${head}`);
const block = message => {
  console.error(
    `Blocked: ${message}\n\nRun the adversarial review first (skill: .claude/skills/adversarial-review/SKILL.md). It records a passing review for the exact commit the PR will contain; then open the PR again.`
  );
  process.exit(2);
};
if (!sha)
  block(
    `can't resolve the PR head branch "${head}" to a commit (push it first).`
  );

const dir = path.join(
  path.resolve(cwd, tryGit('rev-parse', '--git-common-dir') || '.git'),
  'adversarial-reviews'
);
const file = path.join(dir, `${sha}.json`);
if (!existsSync(file))
  block(`no adversarial review recorded for ${head} @ ${sha.slice(0, 7)}.`);

const record = JSON.parse(readFileSync(file, 'utf8'));
if (record.verdict !== 'pass')
  block(
    `the review for ${head} @ ${sha.slice(0, 7)} did not pass (verdict: ${record.verdict}).`
  );
process.exit(0);
