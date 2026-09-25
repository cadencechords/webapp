// Type-checks src with tsc (allowJs + checkJs) against a baseline of known
// errors per file, so CI catches new type errors while the ~1,200 existing
// ones get fixed over time.
//
//   yarn typecheck           fail if any file has more errors than its baseline
//   yarn typecheck --update  rewrite the baseline (after fixing errors)
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const BASELINE = new URL('../typecheck-baseline.json', import.meta.url);
const update = process.argv.includes('--update');

let output = '';
try {
  output = execFileSync('npx', ['tsc', '-p', '.', '--pretty', 'false'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
} catch (error) {
  output = error.stdout ?? ''; // tsc exits non-zero when it reports errors
  if (!output) throw error;
}

// Paths can contain spaces and parentheses (src/components/mobile menus/...).
const ERROR_LINE = /^(.+?)\(\d+,\d+\): error TS\d+/;
const errors = output.split('\n').filter(line => ERROR_LINE.test(line));
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
