// Type-checks src with tsc (allowJs + checkJs) against a baseline of known
// errors per file, so CI catches new type errors while the ~1,200 existing
// ones get fixed over time. Also checks the Node-side TypeScript
// (tsconfig.node.json), which has no baseline, so any error there fails.
//
//   yarn typecheck           fail if any file has more errors than its baseline
//   yarn typecheck --update  rewrite the baseline (after fixing errors)
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const BASELINE = new URL('../typecheck-baseline.json', import.meta.url);
const update = process.argv.includes('--update');

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

// The Node-side project has no baseline, with or without --update.
const node = tsc('tsconfig.node.json');
if (!node.ok) {
  console.error('Type errors in tsconfig.node.json (it has no baseline):\n');
  console.error(node.output);
  process.exit(1);
}

// Every TypeScript file outside src must be in that project. Its include
// globs skip dot-directories, so check against what git sees (tracked, or
// untracked and not ignored) rather than trust them.
//
// Both sides are compared as real paths: tsc (a Go binary) can print paths
// through a symlinked working directory where Node's cwd is the real path,
// it prints forward slashes on Windows, and a file may itself be a symlink.
const root = realpathSync(process.cwd());
function realPath(file) {
  try {
    return realpathSync(file);
  } catch {
    return null; // not a file on disk (a blank line, …)
  }
}
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
const unchecked = execFileSync(
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
  )
  .filter(file => !checked.has(realpathSync(file)));
if (unchecked.length) {
  console.error('TypeScript files that no tsconfig checks:\n');
  for (const file of unchecked) console.error(`  ${file}`);
  console.error('\nAdd them to the include list in tsconfig.node.json.');
  process.exit(1);
}

const { ok, output } = tsc('tsconfig.json');

// Paths can contain spaces and parentheses (src/components/mobile menus/...).
const ERROR_LINE = /^(.+?)\(\d+,\d+\): error TS\d+/;
const lines = output.split('\n');
const errors = lines.filter(
  line => ERROR_LINE.test(line) && !/^tsconfig[^/]*\.json\(/.test(line)
);

// Errors without a source file (a bad compiler option in tsconfig.json, a
// missing types package) can't be baselined, and would otherwise pass
// unnoticed.
const unplaced = lines.filter(
  line =>
    /error TS\d+/.test(line) &&
    (!ERROR_LINE.test(line) || /^tsconfig[^/]*\.json\(/.test(line))
);
if (unplaced.length || (!ok && !errors.length)) {
  console.error('tsc failed:\n');
  console.error(output);
  process.exit(1);
}

const counts = {};
for (const line of errors) {
  const file = line.match(ERROR_LINE)[1];
  counts[file] = (counts[file] ?? 0) + 1;
}
const sorted = Object.fromEntries(
  Object.entries(counts).sort(([a], [b]) => a.localeCompare(b))
);

if (update) {
  writeFileSync(BASELINE, JSON.stringify(sorted, null, 2) + '\n');
  console.log(
    `Baseline updated: ${errors.length} errors in ${Object.keys(sorted).length} files.`
  );
  process.exit(0);
}

const baseline = JSON.parse(readFileSync(BASELINE, 'utf8'));
const regressions = Object.entries(sorted).filter(
  ([file, n]) => n > (baseline[file] ?? 0)
);
const improved = Object.entries(baseline).filter(
  ([file, n]) => (sorted[file] ?? 0) < n
);

if (regressions.length) {
  console.error('New type errors (more than the baseline allows):\n');
  for (const [file, n] of regressions) {
    console.error(`  ${file}: ${n} (baseline ${baseline[file] ?? 0})`);
    for (const line of errors.filter(l => l.startsWith(`${file}(`)))
      console.error(`    ${line.slice(file.length)}`);
  }
  console.error(
    '\nFix them, or if a count went up for a good reason, run `yarn typecheck --update`.'
  );
  process.exit(1);
}

console.log(
  `Typecheck OK: ${errors.length} known errors in ${Object.keys(sorted).length} files, none new.`
);
if (improved.length) {
  console.log(
    `${improved.length} file(s) have fewer errors than the baseline. Run \`yarn typecheck --update\` to lock that in.`
  );
}
