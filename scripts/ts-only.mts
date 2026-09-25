// New code is TypeScript only. Fails if the repo has a JavaScript file
// (.js, .jsx, .mjs, .cjs) that isn't in js-allowlist.json, the list of files
// that existed when the rule started. Converting one to .ts/.tsx is always
// fine, and the allowlist must shrink with it.
//
//   yarn ts-only           fail on any JavaScript file not in the allowlist
//   yarn ts-only --update  drop converted or deleted files from the allowlist
//
// public/ is exempt: files there are served as-is (the OneSignal service
// worker must be JavaScript).
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const ALLOWLIST = new URL('../js-allowlist.json', import.meta.url);
const JS = /\.(js|jsx|mjs|cjs)$/;

// Tracked files plus untracked ones that aren't ignored, so a new file is
// caught before it's committed.
const files = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
)
  .split('\0')
  .filter(file => JS.test(file) && !file.startsWith('public/'))
  // The index still lists a file that was deleted or renamed without git.
  .filter(file => existsSync(file));
const present = new Set(files);

const allowed: string[] = JSON.parse(readFileSync(ALLOWLIST, 'utf8'));

if (process.argv.includes('--update')) {
  const kept = allowed.filter(file => present.has(file));
  writeFileSync(ALLOWLIST, JSON.stringify(kept, null, 2) + '\n');
  console.log(
    `Allowlist updated: ${kept.length} JavaScript files (${allowed.length - kept.length} removed).`
  );
  process.exit(0);
}

const allowedSet = new Set(allowed);
const added = files.filter(file => !allowedSet.has(file));
if (added.length) {
  console.error('New JavaScript files. This repo is TypeScript only:\n');
  for (const file of added) console.error(`  ${file}`);
  console.error(
    '\nWrite them as .ts/.tsx instead. (Renaming or moving a JavaScript file counts as a new file.)'
  );
  process.exit(1);
}

// A stale entry would let a JavaScript file come back at that path.
const gone = allowed.filter(file => !present.has(file));
if (gone.length) {
  console.error(
    'These allowlisted JavaScript files were converted or deleted:\n'
  );
  for (const file of gone) console.error(`  ${file}`);
  console.error('\nRun `yarn ts-only --update` and commit js-allowlist.json.');
  process.exit(1);
}

console.log(`TS only OK: ${files.length} JavaScript files left to convert.`);
