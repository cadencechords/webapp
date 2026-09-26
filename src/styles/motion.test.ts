import { readFileSync } from 'node:fs';
import path from 'node:path';
import { compile } from '@tailwindcss/node';

let css: string;
beforeAll(async () => {
  const compiler = await compile(readFileSync('src/index.css', 'utf8'), {
    base: path.resolve('src'),
    onDependency: () => {},
  });
  css = compiler.build([
    'ease-fast-spatial',
    'ease-default-effects',
    'duration-slow-spatial',
    'transition-default-spatial',
    'transition-fast-effects',
    'shape-morph',
  ]);
});

const rule = (cls: string) =>
  css.match(new RegExp(`\\.${cls}\\s*\\{([^{}]*)`))?.[1] ?? '';

test.each([
  ['fast-spatial', 'cubic-bezier(0.42, 1.67, 0.21, 0.9)', '350ms'],
  ['default-spatial', 'cubic-bezier(0.38, 1.21, 0.22, 1)', '500ms'],
  ['slow-spatial', 'cubic-bezier(0.39, 1.29, 0.35, 0.98)', '650ms'],
  ['fast-effects', 'cubic-bezier(0.31, 0.94, 0.34, 1)', '150ms'],
  ['default-effects', 'cubic-bezier(0.34, 0.8, 0.34, 1)', '200ms'],
  ['slow-effects', 'cubic-bezier(0.34, 0.88, 0.34, 1)', '300ms'],
])('%s token values', (name, curve, duration) => {
  expect(css).toContain(`--md-sys-motion-easing-${name}: ${curve}`);
  expect(css).toContain(`--md-sys-motion-duration-${name}: ${duration}`);
});

test('ease-* and duration-* utilities use the tokens', () => {
  expect(rule('ease-fast-spatial')).toContain(
    'var(--md-sys-motion-easing-fast-spatial)'
  );
  expect(rule('ease-default-effects')).toContain(
    'var(--md-sys-motion-easing-default-effects)'
  );
  expect(rule('duration-slow-spatial')).toContain(
    'transition-duration: var(--md-sys-motion-duration-slow-spatial)'
  );
});

test('spatial transitions move things; effects transitions change color and opacity', () => {
  expect(rule('transition-default-spatial')).toMatch(
    /transition-property: transform, translate, scale, rotate, width, height, inset, border-radius/
  );
  expect(rule('transition-fast-effects')).toMatch(
    /transition-property: color, background-color, border-color, outline-color, fill, stroke, opacity, box-shadow/
  );
});

test('reduced motion turns spatial durations off', () => {
  expect(css).toMatch(
    /@media \(prefers-reduced-motion: reduce\)\s*\{\s*:root\s*\{[^}]*--md-sys-motion-duration-default-spatial: 0ms/
  );
});

test('shape-morph animates corners on the fast-spatial curve when pressed or selected', () => {
  const start = css.indexOf('.shape-morph {');
  const block = css.slice(start, css.indexOf('\n}', start));
  expect(block).toContain(
    'transition: border-radius var(--md-sys-motion-duration-fast-spatial) var(--md-sys-motion-easing-fast-spatial)'
  );
  expect(block).toMatch(/&\[aria-pressed='true'\]/);
  expect(block).toContain(
    'border-radius: var(--shape-morph-to, var(--md-sys-shape-corner-medium))'
  );
});
