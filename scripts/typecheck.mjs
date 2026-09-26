// Type-checks src (tsconfig.json: allowJs + checkJs) and the Node-side
// TypeScript (tsconfig.node.json). Any type error in either fails.
//
//   yarn typecheck
import { execFileSync } from 'node:child_process';
import { existsSync, realpathSync } from 'node:fs';
import path from 'node:path';

if (process.argv.length > 2) {
  console.error(
    `typecheck takes no arguments (got ${process.argv.slice(2).join(' ')}). ` +
      'There is no baseline: fix the errors instead.'
  );
  process.exit(1);
}

function tsc(project, ...args) {
  try {
    const output = execFileSync(
      'npx',
      ['tsc', '-p', project, '--pretty', 'false', ...args],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
    );
    return { ok: true, output };
  } catch (error) {
    // tsc exits non-zero when it reports errors
    if (!error.stdout) throw error;
    return { ok: false, output: error.stdout };
  }
}

// The TypeScript outside src: tracked, or untracked and not ignored. Git is
// the source of truth because tsconfig.node.json's include globs skip
// dot-directories.
const nodeSide = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
)
  .split('\0')
  .filter(
    file =>
      /\.(ts|mts|cts|tsx)$/.test(file) &&
      !/^(src|public|build)\//.test(file) && // excluded in the tsconfigs
      !/(^|\/)node_modules\//.test(file) &&
      existsSync(file) // deleted but not yet staged
  );

// With none, tsc would fail on tsconfig.node.json matching no files (TS18003),
// so there's nothing to check.
if (nodeSide.length) {
  const node = tsc('tsconfig.node.json');
  if (!node.ok) {
    console.error('Type errors in tsconfig.node.json:\n');
    console.error(node.output);
    process.exit(1);
  }

  // Every one of those files must be in that project.
  //
  // Both sides are compared as real paths: tsc (a Go binary) can print paths
  // through a symlinked working directory where Node's cwd is the real path,
  // it prints forward slashes on Windows, and a file may itself be a symlink.
  const root = realpathSync(process.cwd());
  const realPath = file => {
    try {
      return realpathSync(file);
    } catch {
      return null; // not a file on disk (a blank line, …)
    }
  };
  const checked = new Set(
    tsc('tsconfig.node.json', '--listFilesOnly')
      .output.split('\n')
      .map(line => realPath(line.trim()))
      .filter(file => {
        if (!file) return false;
        const relative = path.relative(root, file);
        // The repo's own files, not TypeScript's libs or @types in node_modules.
        return !/^(\.\.|node_modules)([\\/]|$)/.test(relative);
      })
  );
  if (!checked.size) {
    console.error('Could not match tsc --listFilesOnly output to this repo.');
    process.exit(1);
  }
  const unchecked = nodeSide.filter(file => !checked.has(realpathSync(file)));
  if (unchecked.length) {
    console.error('TypeScript files that no tsconfig checks:\n');
    for (const file of unchecked) console.error(`  ${file}`);
    console.error('\nAdd them to the include list in tsconfig.node.json.');
    process.exit(1);
  }
}

const src = tsc('tsconfig.json');
if (!src.ok) {
  console.error('Type errors in tsconfig.json (src):\n');
  console.error(src.output);
  process.exit(1);
}

console.log('Typecheck OK: no type errors.');
