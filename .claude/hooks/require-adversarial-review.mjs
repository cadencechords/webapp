#!/usr/bin/env node
// PreToolUse hook: blocks opening a pull request unless the commit it would
// contain has a passing adversarial review recorded by
// .claude/skills/adversarial-review/record.mjs.
//
// Covers the GitHub MCP create_pull_request tool (Copilot's variant is always
// blocked) and Bash commands that run `gh pr create` / `gh pr new` / a POST to
// the pulls API. Exit 0 allows; exit 2 blocks and shows stderr to Claude. Any
// error blocks too (run-hook.sh turns crashes into exit 2).
//
// This is a guardrail against opening a PR by mistake, not a security
// boundary: the review's contents are self-reported (see SKILL.md).
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HOW =
  'Run the adversarial review first (.claude/skills/adversarial-review/SKILL.md). ' +
  'It records a passing review for the exact commit the PR will contain; then open the PR again.';

class Block extends Error {}
const block = message => {
  throw new Block(message);
};

// ---------------------------------------------------------------- shell parsing

// Splits shell text into simple commands (arrays of words). Quotes and escapes
// are resolved; heredoc bodies are skipped (they're data); the contents of
// $(...) and `...` are returned separately because they also run.
export function parseShell(text) {
  const commands = [[]];
  const substitutions = [];
  const heredocs = [];
  let word = null;
  let i = 0;
  const cmd = () => commands[commands.length - 1];
  const endWord = () => {
    if (word !== null) cmd().push(word);
    word = null;
  };
  const endCommand = () => {
    endWord();
    if (cmd().length) commands.push([]);
  };
  const readUntilClosingParen = start => {
    let depth = 1;
    let j = start;
    for (; j < text.length && depth; j++) {
      if (text[j] === '(') depth++;
      else if (text[j] === ')') depth--;
    }
    if (depth) block('unbalanced $( in the command');
    return j;
  };

  while (i < text.length) {
    const c = text[i];
    if (c === '\n') {
      endCommand();
      i++;
      // Skip pending heredoc bodies that start on this line.
      while (heredocs.length) {
        const { delimiter, stripTabs } = heredocs.shift();
        for (;;) {
          const end = text.indexOf('\n', i);
          const line = text.slice(i, end === -1 ? text.length : end);
          i = end === -1 ? text.length : end + 1;
          if ((stripTabs ? line.replace(/^\t+/, '') : line) === delimiter)
            break;
          if (end === -1) break;
        }
      }
    } else if (c === ' ' || c === '\t') {
      endWord();
      i++;
    } else if (';&|()'.includes(c)) {
      endCommand();
      i++;
    } else if (c === '#' && word === null) {
      while (i < text.length && text[i] !== '\n') i++;
    } else if (c === '<' && text[i + 1] === '<' && text[i + 2] !== '<') {
      endWord();
      const m = text.slice(i).match(/^<<(-?)\s*(['"]?)([\w.-]+)\2/);
      if (!m) block('unparseable heredoc in the command');
      heredocs.push({ delimiter: m[3], stripTabs: m[1] === '-' });
      i += m[0].length;
    } else if (c === "'") {
      const end = text.indexOf("'", i + 1);
      if (end === -1) block('unterminated quote in the command');
      word = (word ?? '') + text.slice(i + 1, end);
      i = end + 1;
    } else if (c === '"') {
      let j = i + 1;
      let value = '';
      while (j < text.length && text[j] !== '"') {
        if (text[j] === '\\' && j + 1 < text.length) {
          value += text[j + 1];
          j += 2;
        } else if (text[j] === '$' && text[j + 1] === '(') {
          const end = readUntilClosingParen(j + 2);
          substitutions.push(text.slice(j + 2, end - 1));
          value += text.slice(j, end);
          j = end;
        } else if (text[j] === '`') {
          const end = text.indexOf('`', j + 1);
          if (end === -1) block('unterminated backquote in the command');
          substitutions.push(text.slice(j + 1, end));
          value += text.slice(j, end + 1);
          j = end + 1;
        } else {
          value += text[j++];
        }
      }
      if (j >= text.length) block('unterminated quote in the command');
      word = (word ?? '') + value;
      i = j + 1;
    } else if (c === '\\') {
      if (text[i + 1] !== '\n') word = (word ?? '') + (text[i + 1] ?? '');
      i += 2;
    } else if (c === '$' && text[i + 1] === '(') {
      const end = readUntilClosingParen(i + 2);
      substitutions.push(text.slice(i + 2, end - 1));
      word = (word ?? '') + text.slice(i, end);
      i = end;
    } else if (c === '`') {
      const end = text.indexOf('`', i + 1);
      if (end === -1) block('unterminated backquote in the command');
      substitutions.push(text.slice(i + 1, end));
      word = (word ?? '') + text.slice(i, end + 1);
      i = end + 1;
    } else {
      word = (word ?? '') + c;
      i++;
    }
  }
  endWord();
  return { commands: commands.filter(c => c.length), substitutions };
}

const WRAPPERS = new Set([
  'env',
  'time',
  'command',
  'exec',
  'nice',
  'nohup',
  'sudo',
]);
const SHELLS = new Set(['sh', 'bash', 'zsh', 'dash']);
const MOVES = new Set(['cd', 'pushd', 'popd']);
const GH_GLOBAL_WITH_VALUE = new Set(['-R', '--repo', '--hostname']);
const API_WRITE_FLAGS = /^(-f|-F|--field|--raw-field|--input)(=|$)/;

// Finds PR-creating gh calls in a Bash command. Returns
// [{ head, repo, moved }], where `moved` means an earlier command in the same
// line may have changed directory or branch.
export function findPrCreations(text) {
  const found = [];
  const { commands, substitutions } = parseShell(text);
  let moved = false;
  for (let words of commands) {
    words = [...words];
    while (words.length && /^\w+=/.test(words[0])) words.shift(); // VAR=x
    while (words.length && WRAPPERS.has(path.basename(words[0]))) {
      words.shift();
      while (
        words.length &&
        (words[0].startsWith('-') || /^\w+=/.test(words[0]))
      )
        words.shift();
    }
    if (!words.length) continue;
    const program = path.basename(words[0]);

    if (SHELLS.has(program)) {
      const c = words.indexOf('-c');
      if (c !== -1 && words[c + 1])
        found.push(
          ...findPrCreations(words[c + 1]).map(f => ({
            ...f,
            moved: f.moved || moved,
          }))
        );
      continue;
    }
    if (
      MOVES.has(program) ||
      (program === 'git' && /^(checkout|switch|worktree)$/.test(words[1] || ''))
    ) {
      moved = true;
      continue;
    }
    if (program !== 'gh') continue;

    let repo = null;
    let k = 1;
    while (k < words.length && words[k].startsWith('-')) {
      const [flag, inline] = words[k].split(/=(.*)/s);
      if (GH_GLOBAL_WITH_VALUE.has(flag)) {
        const value = inline ?? words[++k];
        if (flag !== '--hostname') repo = value;
      }
      k++;
    }
    const [group, action, ...rest] = words.slice(k);
    if (rest.includes('--help') || rest.includes('-h')) continue;

    if (group === 'pr' && (action === 'create' || action === 'new')) {
      let head = null;
      for (let j = 0; j < rest.length; j++) {
        const [flag, inline] = rest[j].split(/=(.*)/s);
        if (flag === '-H' || flag === '--head') head = inline ?? rest[++j];
        else if (flag === '-R' || flag === '--repo') repo = inline ?? rest[++j];
        else if (/^-H./.test(rest[j])) head = rest[j].slice(2);
      }
      found.push({ head, repo, moved });
    } else if (group === 'api') {
      const args = [action, ...rest];
      let method = '';
      for (let j = 0; j < args.length; j++) {
        if (args[j] === '-X' || args[j] === '--method')
          method = args[j + 1] || '';
        else if (args[j].startsWith('--method=')) method = args[j].slice(9);
        else if (/^-X./.test(args[j])) method = args[j].slice(2);
      }
      method = method.toUpperCase();
      // gh api defaults to POST when fields are given.
      const writes =
        method === 'POST' ||
        (!method && args.some(a => API_WRITE_FLAGS.test(a)));
      if (writes && args.some(a => /(^|\/)pulls\/?$/.test(a))) {
        block(
          "opening a PR through `gh api` can't be checked; use `gh pr create --head <branch>` or the create_pull_request tool after the review"
        );
      }
    }
  }
  for (const sub of substitutions)
    found.push(
      ...findPrCreations(sub).map(f => ({ ...f, moved: f.moved || moved }))
    );
  return found;
}

// ---------------------------------------------------------------- git

function makeGit(cwd) {
  const run = (...args) =>
    execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 15000,
    }).trim();
  const tryRun = (...args) => {
    try {
      return run(...args);
    } catch {
      return null;
    }
  };
  return { run, tryRun };
}

// "owner/repo" of a remote URL: https, ssh, scp-like, local and proxy paths.
export function ownerRepo(url) {
  const m = String(url || '')
    .replace(/\/+$/, '')
    .replace(/\.git$/, '')
    .match(/([^/:]+)[/:]([^/:]+)$/);
  return m ? `${m[1]}/${m[2]}`.toLowerCase() : null;
}

function checkPr({ cwd, head, repo, moved }) {
  const { run, tryRun } = makeGit(cwd);
  if (tryRun('rev-parse', '--git-dir') === null)
    block(`${cwd} isn't a git repository`);

  if (!head) {
    if (moved)
      block(
        'the command changes directory or branch before opening the PR, so the head branch is unknown; pass --head <branch>'
      );
    head = tryRun('symbolic-ref', '--quiet', '--short', 'HEAD');
    if (!head)
      block(
        'HEAD is detached, so the PR head branch is unknown; pass --head <branch>'
      );
  }

  const branch = tryRun('rev-parse', '--abbrev-ref', 'HEAD');
  const remote =
    (branch && tryRun('config', `branch.${branch}.remote`)) ||
    tryRun('config', `branch.${head.replace(/^[^:]+:/, '')}.remote`) ||
    'origin';
  const remoteUrl = tryRun('remote', 'get-url', remote);
  if (!remoteUrl) block(`no git remote "${remote}"`);
  const [remoteOwner] = ownerRepo(remoteUrl).split('/');

  if (repo && ownerRepo(repo) !== ownerRepo(remoteUrl)) {
    block(
      `the PR targets ${repo}, but this checkout's reviews are for ${ownerRepo(remoteUrl)}`
    );
  }
  const fork = head.match(/^([^:]+):(.+)$/);
  if (fork) {
    if (fork[1].toLowerCase() !== remoteOwner)
      block(
        `head ${head} is on a fork; only branches pushed to ${ownerRepo(remoteUrl)} can be checked`
      );
    head = fork[2];
  }
  if (tryRun('check-ref-format', '--branch', head) === null)
    block(`"${head}" isn't a valid branch name`);

  // What the PR will contain is what's on the remote now, not a stale local ref.
  if (
    tryRun(
      'fetch',
      '--quiet',
      '--no-tags',
      remote,
      `+refs/heads/${head}:refs/remotes/${remote}/${head}`
    ) === null
  ) {
    block(
      `couldn't fetch ${remote}/${head} to see what the PR would contain (is it pushed?)`
    );
  }
  const sha = run('rev-parse', `refs/remotes/${remote}/${head}`);

  const dir = path.resolve(
    cwd,
    run('rev-parse', '--git-common-dir'),
    'adversarial-reviews'
  );
  const file = path.join(dir, `${sha}.json`);
  if (!existsSync(file))
    block(`no adversarial review recorded for ${head} @ ${sha.slice(0, 7)}`);
  let record;
  try {
    record = JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    block(`the review record for ${sha.slice(0, 7)} is unreadable`);
  }
  if (record.verdict !== 'pass' || record.sha !== sha) {
    block(
      `the review for ${head} @ ${sha.slice(0, 7)} did not pass (verdict: ${record.verdict})`
    );
  }
}

// ---------------------------------------------------------------- main

export function main(input) {
  const tool = input.tool_name || '';
  const args = input.tool_input || {};
  const cwd = input.cwd || process.cwd();

  if (/create_pull_request/.test(tool)) {
    if (!/(^|__)create_pull_request$/.test(tool))
      block(
        `${tool} can't be checked for a review; open PRs with create_pull_request after the review`
      );
    if (!args.owner || !args.repo)
      block(`${tool} was called without owner and repo`);
    checkPr({
      cwd,
      head: args.head,
      repo: `${args.owner}/${args.repo}`,
      moved: false,
    });
  } else if (tool === 'Bash' && /\bgh\b/.test(args.command || '')) {
    for (const pr of findPrCreations(args.command)) checkPr({ cwd, ...pr });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main(JSON.parse(readFileSync(0, 'utf8')));
    process.exit(0);
  } catch (error) {
    const reason =
      error instanceof Block
        ? error.message
        : `the review hook failed (${error.message}); blocking to be safe`;
    console.error(`Blocked: ${reason}.\n\n${HOW}`);
    process.exit(2);
  }
}
