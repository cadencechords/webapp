// Type-checks src with tsc (allowJs + checkJs) against a baseline of known
// errors per file, so CI catches new type errors while the ~1,200 existing
// ones get fixed over time. Also checks the Node-side TypeScript
// (tsconfig.node.json), which has no baseline, so any error there fails.
//
//   yarn typecheck           fail if any file has more errors than its baseline
//   yarn typecheck --update  rewrite the baseline (after fixing errors)
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const BASELINE = new URL('../typecheck-baseline.json', import.meta.url);
const update = process.argv.includes('--update');

function tsc(project) {
  try {
    const output = execFileSync(
      'npx',
      ['tsc', '-p', project, '--pretty', 'false'],
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
