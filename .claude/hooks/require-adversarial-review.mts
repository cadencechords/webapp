#!/usr/bin/env node
// PreToolUse hook: blocks opening a pull request unless the commit it would
// contain has a passing adversarial review recorded by
// .claude/skills/adversarial-review/record.mts.
//
// Covers the GitHub MCP create_pull_request tool (Copilot's variant is always
// blocked) and Bash commands that run `gh pr create` / `gh pr new` / a POST to
// the pulls API. Exit 0 allows; exit 2 blocks and shows stderr to Claude. Any
// error blocks too (run-hook.sh turns crashes into exit 2).
//
// This is a guardrail against opening a PR by mistake, not a security
// boundary: the review's contents are self-reported (see SKILL.md).
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HOW =
  'Run the adversarial review first (.claude/skills/adversarial-review/SKILL.md). ' +
  'It records a passing review for the exact commit the PR will contain; then open the PR again.';

class Block extends Error {}
// Annotated so TypeScript knows code after a block() call doesn't run.
const block: (message: string) => never = message => {
  throw new Block(message);
};

type Heredoc = { length: number; delimiter: string; stripTabs: boolean };
type Command = { words: string[]; heredocs: string[] };
type PrCreation = { head: string | null; repo: string | null; moved: boolean };

// ---------------------------------------------------------------- shell parsing

// Reads a heredoc operator at text[i] ("<<", "<<-") and returns its delimiter,
// or null for "<<<" (here-string) and "<<=" (arithmetic).
function heredocAt(text: string, i: number): Heredoc | null {
  if (
    text[i] !== '<' ||
    text[i + 1] !== '<' ||
    text[i + 2] === '<' ||
    text[i + 2] === '='
  )
    return null;
  const m = text.slice(i).match(/^<<(-?)[ \t]*(['"]?)([^\s'"<>;&|()]+)\2/);
  if (!m) block('unparseable heredoc in the command');
  return { length: m[0].length, delimiter: m[3], stripTabs: m[1] === '-' };
}

// Returns [body, index after the delimiter line] for a heredoc whose body
// starts at text[i] (the character after the newline).
function readHeredocBody(
  text: string,
  i: number,
  { delimiter, stripTabs }: Heredoc
): [string, number] {
  const lines: string[] = [];
  while (i < text.length) {
    const end = text.indexOf('\n', i);
    const line = text.slice(i, end === -1 ? text.length : end);
    i = end === -1 ? text.length : end + 1;
    if ((stripTabs ? line.replace(/^\t+/, '') : line) === delimiter)
      return [lines.join('\n'), i];
    lines.push(line);
  }
  return [lines.join('\n'), i]; // unterminated: bash reads to the end
}

// Given text[start] just after "$(", returns the index just after the
// matching ")". Aware of quotes, escapes, nested substitutions, comments and
// heredocs, so parentheses inside a PR body don't confuse it.
function substitutionEnd(text: string, start: number): number {
  let depth = 1;
  let i = start;
  const pending: Heredoc[] = [];
  while (i < text.length) {
    const c = text[i];
    if (c === '\\') i += 2;
    else if (c === "'") {
      const end = text.indexOf("'", i + 1);
      if (end === -1) block('unterminated quote in the command');
      i = end + 1;
    } else if (c === '"') {
      i++;
      while (i < text.length && text[i] !== '"') {
        if (text[i] === '\\') i += 2;
        else if (text[i] === '$' && text[i + 1] === '(')
          i = substitutionEnd(text, i + 2);
        else i++;
      }
      if (i >= text.length) block('unterminated quote in the command');
      i++;
    } else if (c === '`') {
      const end = text.indexOf('`', i + 1);
      if (end === -1) block('unterminated backquote in the command');
      i = end + 1;
    } else if (c === '$' && text[i + 1] === '(') {
      i = substitutionEnd(text, i + 2);
    } else if (c === '#' && (i === start || /[\s;&|(]/.test(text[i - 1]))) {
      while (i < text.length && text[i] !== '\n') i++;
    } else if (heredocAt(text, i)) {
      // Same pure call as the condition, which returned a heredoc.
      const h = heredocAt(text, i)!;
      pending.push(h);
      i += h.length;
    } else if (c === '\n' && pending.length) {
      i++;
      // The loop condition means shift() returns an element.
      while (pending.length) [, i] = readHeredocBody(text, i, pending.shift()!);
    } else if (c === '(') {
      depth++;
      i++;
    } else if (c === ')') {
      depth--;
      i++;
      if (!depth) return i;
    } else i++;
  }
  block('unbalanced $( in the command');
}

// Splits shell text into simple commands: { words, heredocs } where words
// have quotes and escapes resolved and heredocs are the bodies fed to that
// command. The contents of $(...) and `...` are returned separately, since
// they run too.
export function parseShell(text: string): {
  commands: Command[];
  substitutions: string[];
} {
  const commands: Command[] = [{ words: [], heredocs: [] }];
  const substitutions: string[] = [];
  const pending: { target: Command; heredoc: Heredoc }[] = [];
  let word: string | null = null;
  let i = 0;
  const cmd = () => commands[commands.length - 1];
  const add = (s: string) => (word = (word ?? '') + s);
  const endWord = () => {
    if (word !== null) cmd().words.push(word);
    word = null;
  };
  const endCommand = () => {
    endWord();
    if (cmd().words.length || cmd().heredocs.length)
      commands.push({ words: [], heredocs: [] });
  };
  const substitution = (at: number) => {
    const end = substitutionEnd(text, at + 2);
    substitutions.push(text.slice(at + 2, end - 1));
    return end;
  };

  while (i < text.length) {
    const c = text[i];
    const h = c === '<' ? heredocAt(text, i) : null;
    if (c === '\n') {
      const owner = cmd();
      endCommand();
      i++;
      while (pending.length) {
        // The loop condition means shift() returns an element.
        const { target, heredoc } = pending.shift()!;
        let body: string;
        [body, i] = readHeredocBody(text, i, heredoc);
        (target || owner).heredocs.push(body);
      }
    } else if (c === ' ' || c === '\t') {
      endWord();
      i++;
    } else if (';&|(){}!'.includes(c) && word === null) {
      endCommand();
      i++;
    } else if (';&|()'.includes(c)) {
      endCommand();
      i++;
    } else if (c === '#' && word === null) {
      while (i < text.length && text[i] !== '\n') i++;
    } else if (h) {
      endWord();
      pending.push({ target: cmd(), heredoc: h });
      i += h.length;
    } else if (c === '<' && text.startsWith('<<<', i)) {
      endWord();
      i += 3;
    } else if (c === "'") {
      const end = text.indexOf("'", i + 1);
      if (end === -1) block('unterminated quote in the command');
      add(text.slice(i + 1, end));
      i = end + 1;
    } else if (c === '$' && text[i + 1] === "'") {
      // ANSI-C quoting: backslash escapes, ends at an unescaped quote.
      let j = i + 2;
      let value = '';
      while (j < text.length && text[j] !== "'") {
        if (text[j] === '\\' && j + 1 < text.length) {
          value +=
            text[j + 1] === 'n'
              ? '\n'
              : text[j + 1] === 't'
                ? '\t'
                : text[j + 1];
          j += 2;
        } else value += text[j++];
      }
      if (j >= text.length) block('unterminated quote in the command');
      add(value);
      i = j + 1;
    } else if (c === '"') {
      let j = i + 1;
      let value = '';
      while (j < text.length && text[j] !== '"') {
        if (text[j] === '\\' && j + 1 < text.length) {
          value += text[j + 1];
          j += 2;
        } else if (text[j] === '$' && text[j + 1] === '(') {
          const end = substitution(j);
          value += text.slice(j, end);
          j = end;
        } else if (text[j] === '`') {
          const end = text.indexOf('`', j + 1);
          if (end === -1) block('unterminated backquote in the command');
          substitutions.push(text.slice(j + 1, end));
          value += text.slice(j, end + 1);
          j = end + 1;
        } else value += text[j++];
      }
      if (j >= text.length) block('unterminated quote in the command');
      add(value);
      i = j + 1;
    } else if (c === '\\') {
      if (text[i + 1] !== '\n') add(text[i + 1] ?? '');
      i += 2;
    } else if (c === '$' && text[i + 1] === '(') {
      const end = substitution(i);
      add(text.slice(i, end));
      i = end;
    } else if (c === '`') {
      const end = text.indexOf('`', i + 1);
      if (end === -1) block('unterminated backquote in the command');
      substitutions.push(text.slice(i + 1, end));
      add(text.slice(i, end + 1));
      i = end + 1;
    } else {
      add(c);
      i++;
    }
  }
  endWord();
  return {
    commands: commands.filter(c => c.words.length || c.heredocs.length),
    substitutions,
  };
}

// gh flags that take a value (gh pr create's, plus the global -R/--repo).
const VALUE_SHORT = new Set('aBbFHlmprRTt');
const VALUE_LONG = new Set([
  'title',
  'body',
  'body-file',
  'base',
  'head',
  'assignee',
  'label',
  'milestone',
  'project',
  'reviewer',
  'template',
  'repo',
  'recover',
  'hostname',
]);
// Programs that run their string arguments or stdin as shell commands.
const RUNS_SHELL = new Set([
  'sh',
  'bash',
  'zsh',
  'dash',
  'ksh',
  'eval',
  'xargs',
  'watch',
  'su',
  'ssh',
]);
const MOVES = new Set(['cd', 'pushd', 'popd']);
const API_WRITE_FLAGS = /^(-f|-F|--field|--raw-field|--input)(=|$)/;

// Parses gh's arguments (after the "gh" word). Returns { head, repo } for a PR
// creation, null otherwise; blocks on `gh api` PR creation.
function analyzeGh(
  args: string[],
  env: Record<string, string>
): { head: string | null; repo: string | null } | null {
  let repo = env.GH_REPO || null;
  let k = 0;
  while (k < args.length && args[k].startsWith('-')) {
    const [flag, inline] = args[k].split(/=(.*)/s);
    if (flag === '-R' || flag === '--repo') repo = inline ?? args[++k];
    else if (flag === '--hostname' && inline === undefined) k++;
    else if (/^-R./.test(args[k])) repo = args[k].slice(2);
    k++;
  }
  const [group, action] = [args[k], args[k + 1]];
  const rest = args.slice(k + 2);

  if (group === 'pr' && (action === 'create' || action === 'new')) {
    let head: string | null = null;
    let help = false;
    for (let j = 0; j < rest.length; j++) {
      const a = rest[j];
      if (a === '--') break;
      if (a.startsWith('--')) {
        const [name, inline] = a.slice(2).split(/=(.*)/s);
        if (name === 'help') help = true;
        else if (VALUE_LONG.has(name)) {
          const value = inline ?? rest[++j];
          if (name === 'head') head = value;
          if (name === 'repo') repo = value;
        }
      } else if (a.startsWith('-') && a.length > 1) {
        // pflag short flags: "-dHfeat" is -d plus -H feat.
        for (let c = 1; c < a.length; c++) {
          if (a[c] === 'h') help = true;
          else if (VALUE_SHORT.has(a[c])) {
            const value = a.slice(c + 1) || rest[++j];
            if (a[c] === 'H') head = value;
            if (a[c] === 'R') repo = value;
            break;
          }
        }
      }
    }
    return help ? null : { head, repo };
  }

  if (group === 'api') {
    const apiArgs = args.slice(k + 1);
    let method = '';
    for (let j = 0; j < apiArgs.length; j++) {
      if (apiArgs[j] === '-X' || apiArgs[j] === '--method')
        method = apiArgs[j + 1] || '';
      else if (apiArgs[j].startsWith('--method=')) method = apiArgs[j].slice(9);
      else if (/^-X./.test(apiArgs[j])) method = apiArgs[j].slice(2);
    }
    method = method.toUpperCase();
    // gh api defaults to POST when fields are given.
    const writes =
      method === 'POST' ||
      (!method && apiArgs.some(a => API_WRITE_FLAGS.test(a)));
    if (writes && apiArgs.some(a => /(^|\/)pulls\/?$/.test(a))) {
      block(
        "opening a PR through `gh api` can't be checked; use `gh pr create --head <branch>` or the create_pull_request tool after the review"
      );
    }
  }
  return null;
}

// Finds PR-creating gh calls in a Bash command. Returns [{ head, repo, moved }],
// where `moved` means an earlier command changed directory or branch, so this
// checkout may not be where the PR comes from.
//
// Deliberately broad: `gh` is looked for anywhere in each simple command (so
// `then gh`, `timeout 60 gh`, `sudo -u me gh` are caught), and strings or
// heredocs given to a shell (`bash -lc '…'`, `eval`, `xargs`) are parsed too.
export function findPrCreations(text: string, depth = 0): PrCreation[] {
  if (depth > 5) block('the command nests shells too deeply to check');
  const found: PrCreation[] = [];
  const { commands, substitutions } = parseShell(text);
  let moved = false;
  const nested = (inner: string) =>
    found.push(
      ...findPrCreations(inner, depth + 1).map(f => ({
        ...f,
        moved: f.moved || moved,
      }))
    );

  for (const { words, heredocs } of commands) {
    const env: Record<string, string> = {};
    let s = 0;
    for (; s < words.length && /^[A-Za-z_]\w*=/.test(words[s]); s++) {
      const [name, value] = words[s].split(/=(.*)/s);
      env[name] = value;
    }
    const names = words.map(w => path.basename(w));
    names.forEach((name, i) => {
      if (i < s || name !== 'gh') return;
      const pr = analyzeGh(words.slice(i + 1), env);
      if (pr) found.push({ ...pr, moved });
    });
    if (names.some(n => RUNS_SHELL.has(n))) {
      for (const w of words.slice(s))
        if (/\bgh\b/.test(w) && /\s/.test(w)) nested(w);
      for (const body of heredocs) nested(body);
    }
    const git = names.indexOf('git');
    if (
      names.some(n => MOVES.has(n)) ||
      (git !== -1 &&
        words
          .slice(git + 1)
          .some(w => /^(checkout|switch|worktree|-C)$/.test(w)))
    ) {
      moved = true;
    }
  }
  for (const sub of substitutions) nested(sub);
  return found;
}

// ---------------------------------------------------------------- git

function makeGit(cwd: string) {
  const run = (...args: string[]) =>
    execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 15000,
    }).trim();
  const tryRun = (...args: string[]) => {
    try {
      return run(...args);
    } catch {
      return null;
    }
  };
  return { run, tryRun };
}

// "owner/repo" of a remote URL: https, ssh, scp-like, local and proxy paths.
export function ownerRepo(url: unknown): string | null {
  const m = String(url || '')
    .replace(/\/+$/, '')
    .replace(/\.git$/, '')
    .match(/([^/:]+)[/:]([^/:]+)$/);
  return m ? `${m[1]}/${m[2]}`.toLowerCase() : null;
}

type Review = { sha?: unknown; verdict?: unknown; checks?: unknown };

function checkPr({
  cwd,
  head,
  repo,
  moved,
}: {
  cwd: string;
  head: string | null | undefined;
  repo: string | null;
  moved: boolean;
}) {
  const { run, tryRun } = makeGit(cwd);
  if (tryRun('rev-parse', '--git-dir') === null)
    block(`${cwd} isn't a git repository`);

  if (moved) {
    block(
      'the command changes directory or branch before opening the PR, so which checkout and branch it is for is unknown; run gh pr create on its own from the checkout'
    );
  }
  if (!head) {
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
  // Null only for a URL without an owner/repo; then this throws, and a crash
  // blocks the PR.
  const [remoteOwner] = ownerRepo(remoteUrl)!.split('/');

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
  let record: Review;
  try {
    record = JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    block(`the review record for ${sha.slice(0, 7)} is unreadable`);
  }
  if (record.sha !== sha)
    block(
      `the review record for ${sha.slice(0, 7)} wasn't written by record.mts for this commit`
    );
  if (record.verdict !== 'pass')
    block(
      `the review for ${head} @ ${sha.slice(0, 7)} did not pass (verdict: ${record.verdict})`
    );
  const checks = Object.entries(record.checks || {});
  if (!checks.length || checks.some(([, result]) => result !== 'pass')) {
    block(
      `the review record for ${sha.slice(0, 7)} doesn't show passing checks`
    );
  }
}

// ---------------------------------------------------------------- main

type HookInput = {
  tool_name?: string;
  tool_input?: {
    owner?: string;
    repo?: string;
    head?: string;
    command?: string;
  };
  cwd?: string;
};

export function main(input: HookInput): void {
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
    // The test above only matches a command that is a non-empty string.
    for (const pr of findPrCreations(args.command!)) checkPr({ cwd, ...pr });
  }
}

// Real paths on both sides: run through a symlinked directory, argv[1] keeps
// the symlink while import.meta.url is resolved, and a plain comparison would
// skip main() and exit 0, letting the PR through.
if (
  process.argv[1] &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
  try {
    main(JSON.parse(readFileSync(0, 'utf8')));
    process.exit(0);
  } catch (error) {
    const reason =
      error instanceof Block
        ? error.message
        : // Node, git and JSON.parse only throw Errors here.
          `the review hook failed (${(error as Error).message}); blocking to be safe`;
    console.error(`Blocked: ${reason}.\n\n${HOW}`);
    process.exit(2);
  }
}
