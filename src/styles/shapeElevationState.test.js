import { readFileSync } from 'node:fs';
import path from 'node:path';
import { compile } from '@tailwindcss/node';

let css;
beforeAll(async () => {
  const compiler = await compile(readFileSync('src/index.css', 'utf8'), {
    base: path.resolve('src'),
    onDependency: () => {},
  });
  css = compiler.build([
    'rounded-extra-small',
    'rounded-large-increased',
    'rounded-extra-extra-large',
    'rounded-lg',
    'rounded-sm',
    'elevation-0',
    'elevation-3',
    'elevation-5',
    'state-layer',
    'focus-ring',
  ]);
});

// The body of the first rule for a class (not counting nested rules).
const rule = cls =>
  css.match(new RegExp(`\\.${cls}\\s*\\{([^{}]*)`))?.[1] ?? '';

test.each([
  ['rounded-extra-small', '--md-sys-shape-corner-extra-small'],
  ['rounded-large-increased', '--md-sys-shape-corner-large-increased'],
  ['rounded-extra-extra-large', '--md-sys-shape-corner-extra-extra-large'],
])('%s uses its shape token', (cls, token) => {
  expect(rule(cls)).toContain(`border-radius: var(${token})`);
});

test('Tailwind radius utilities used by existing screens are unchanged', () => {
  expect(rule('rounded-lg')).toContain('border-radius: var(--radius-lg)');
  expect(css).toMatch(/--radius-lg: 0\.5rem/);
  expect(css).toMatch(/--radius-sm: 0\.25rem/);
});

test.each([
  ['elevation-0', 'surface', 'level0'],
  ['elevation-3', 'surface-container-high', 'level3'],
  ['elevation-5', 'surface-container-highest', 'level5'],
])('%s sets tone and shadow', (cls, tone, level) => {
  expect(rule(cls)).toContain(`background-color: var(--md-sys-color-${tone})`);
  expect(rule(cls)).toContain(`box-shadow: var(--md-sys-elevation-${level})`);
});

test('state-layer overlays currentColor at the M3 opacities', () => {
  // Nested (&::before) here; the production build flattens it.
  const start = css.indexOf('.state-layer {');
  const block = css.slice(
    start,
    css.indexOf('\n  }\n', css.indexOf('[aria-disabled', start))
  );
  expect(block).toMatch(/&::before\s*\{[^}]*background-color: currentColor/);
  for (const [state, token] of [
    ['&:hover', 'hover'],
    ['&:focus-visible', 'focus'],
    ['&:active', 'pressed'],
    ['&[data-dragging]', 'dragged'],
  ]) {
    expect(block).toMatch(
      new RegExp(
        `${state.replace(/[[\]]/g, '\\$&')}::before\\s*\\{\\s*opacity: var\\(--md-sys-state-${token}-state-layer-opacity\\)`
      )
    );
  }
  expect(css).toMatch(/--md-sys-state-hover-state-layer-opacity: 0\.08/);
  expect(css).toMatch(/--md-sys-state-dragged-state-layer-opacity: 0\.16/);
});

test('focus-ring draws a secondary outline on keyboard focus', () => {
  expect(css).toMatch(
    /\.focus-ring:focus-visible\s*\{[^}]*outline: var\(--md-sys-state-focus-indicator-thickness\) solid var\(--md-sys-color-secondary\)/
  );
});
