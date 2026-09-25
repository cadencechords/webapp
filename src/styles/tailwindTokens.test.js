// Compiles src/index.css with Tailwind to check the token utilities exist.
// (The app build only emits utilities that the source uses.)
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { compile } from '@tailwindcss/node';

let css;

beforeAll(async () => {
  const base = path.resolve('src');
  const compiler = await compile(readFileSync('src/index.css', 'utf8'), { base, onDependency: () => {} });
  css = compiler.build([
    'bg-primary-container', 'text-on-primary-container', 'text-on-surface-variant',
    'border-outline-variant', 'bg-surface-container-highest', 'bg-inverse-surface', 'bg-scrim/50',
  ]);
});

test.each([
  ['bg-primary-container', 'background-color: var(--md-sys-color-primary-container)'],
  ['text-on-surface-variant', 'color: var(--md-sys-color-on-surface-variant)'],
  ['border-outline-variant', 'border-color: var(--md-sys-color-outline-variant)'],
  ['bg-surface-container-highest', 'background-color: var(--md-sys-color-surface-container-highest)'],
])('%s uses its token', (cls, decl) => {
  const rule = css.match(new RegExp(`\\.${cls}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
  expect(rule).toContain(decl);
});

test('light and dark values are both defined', () => {
  expect(css).toMatch(/:root\s*\{[^}]*--md-sys-color-primary: #/);
  expect(css).toMatch(/\.dark\s*\{[^}]*--md-sys-color-primary: #/);
});

test('bottom sheet handle keeps its 40% alpha', () => {
  expect(css).toMatch(/--rsbs-handle-bg: color-mix\(in (srgb|oklab), var\(--md-sys-color-on-surface-variant\) 40%, transparent\)/);
});
