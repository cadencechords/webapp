import { readFileSync } from 'node:fs';
import path from 'node:path';
import { compile } from '@tailwindcss/node';
import { SCALE, emphasize, renderCss } from '../../scripts/type-tokens.mts';

test('checked-in type-tokens.css matches the generator (run yarn tokens:type)', () => {
  expect(readFileSync('src/styles/type-tokens.css', 'utf8')).toBe(renderCss());
});

test('every role and size has a base and an emphasized style', () => {
  const css = renderCss();
  for (const [role, size] of SCALE) {
    expect(css).toContain(`--text-${role}-${size}:`);
    expect(css).toContain(`--text-${role}-${size}-emphasized:`);
  }
});

test.each([
  [400, 500],
  [500, 700],
])('emphasized weight of %i is %i', (base, emphasized) => {
  expect(emphasize(base)).toBe(emphasized);
});

describe('Tailwind utilities', () => {
  let css: string;
  beforeAll(async () => {
    const compiler = await compile(readFileSync('src/index.css', 'utf8'), {
      base: path.resolve('src'),
      onDependency: () => {},
    });
    css = compiler.build([
      'text-headline-large',
      'text-title-medium-emphasized',
      'font-plain',
    ]);
  });

  const rule = (cls: string) =>
    css.match(new RegExp(`\\.${cls}\\s*\\{([^}]*)\\}`))?.[1] ?? '';

  test('text-headline-large sets size, line height, tracking and weight', () => {
    const r = rule('text-headline-large');
    expect(r).toContain(
      'font-size: var(--md-sys-typescale-headline-large-size)'
    );
    expect(r).toContain(
      'line-height: var(--tw-leading, var(--md-sys-typescale-headline-large-line-height))'
    );
    expect(r).toContain(
      'letter-spacing: var(--tw-tracking, var(--md-sys-typescale-headline-large-tracking))'
    );
    expect(r).toContain(
      'font-weight: var(--tw-font-weight, var(--md-sys-typescale-headline-large-weight))'
    );
  });

  test('emphasized utility uses the emphasized weight token', () => {
    expect(rule('text-title-medium-emphasized')).toContain(
      'var(--md-sys-typescale-title-medium-emphasized-weight)'
    );
  });

  test('font-plain uses Roboto Flex', () => {
    expect(rule('font-plain')).toContain(
      'font-family: var(--md-ref-typeface-plain)'
    );
    expect(css).toMatch(/--md-ref-typeface-plain: 'Roboto Flex'/);
  });
});
