import { expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { compile } from '@tailwindcss/node';
import { argbFromHex, Hct } from '@material/material-color-utilities';
import { USER_COLORS, generateUserColor } from '../../scripts/color-tokens.mjs';
import { COLORS as BINDER_COLORS } from './BinderUtils';
import { USER_COLOR_NAMES, userColorClasses } from './userColors';

const CHROMATIC = [
  'red',
  'blue',
  'green',
  'yellow',
  'pink',
  'purple',
  'indigo',
] as const;
const EVENT_COLORS = [
  'red',
  'blue',
  'yellow',
  'green',
  'pink',
  'purple',
  'indigo',
  'gray',
  'black',
]; // EventColorOptions.js
const NOTE_COLORS = ['blue', 'green', 'yellow', 'pink']; // Note.js

const hue = (hex: string) => Hct.fromInt(argbFromHex(hex)).hue;
const hueDistance = (a: number, b: number) =>
  Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
function contrast(a: string, b: string) {
  const lum = (hex: string) => {
    const [r, g, b] = [1, 3, 5]
      .map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test('covers every color the app stores', () => {
  const stored = new Set([
    ...BINDER_COLORS.filter(c => c !== 'none'),
    ...EVENT_COLORS,
    ...NOTE_COLORS,
  ]);
  expect(new Set(USER_COLOR_NAMES)).toEqual(stored);
  expect(Object.keys(USER_COLORS).sort()).toEqual([...USER_COLOR_NAMES].sort());
});

describe.each(USER_COLOR_NAMES)('%s', name => {
  const { light, dark } = generateUserColor(name);

  test.each([
    ['light', light],
    ['dark', dark],
  ])('%s text meets 4.5:1', (_, c) => {
    expect(contrast(c['on-color'], c.color)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(c['on-container'], c.container)).toBeGreaterThanOrEqual(
      4.5
    );
  });
});

test.each(CHROMATIC)('%s keeps its hue (within 10 degrees)', name => {
  expect(
    hueDistance(
      hue(generateUserColor(name).light.color),
      hue(USER_COLORS[name])
    )
  ).toBeLessThanOrEqual(10);
});

test('chromatic colors stay distinguishable from each other', () => {
  for (const a of CHROMATIC) {
    for (const b of CHROMATIC) {
      if (a < b)
        expect(
          hueDistance(
            hue(generateUserColor(a).light.color),
            hue(generateUserColor(b).light.color)
          ),
          `${a}/${b}`
        ).toBeGreaterThanOrEqual(10);
    }
  }
});

test('gray and black are near-neutral', () => {
  for (const name of ['gray', 'black']) {
    expect(
      Hct.fromInt(argbFromHex(generateUserColor(name).light.container)).chroma
    ).toBeLessThan(8);
  }
});

describe('userColorClasses', () => {
  test('unknown, empty and "none" fall back to neutral roles', () => {
    for (const name of ['none', '', undefined, 'teal']) {
      expect(userColorClasses(name).container).toBe(
        'bg-surface-container-highest'
      );
    }
  });

  test('every class compiles to its token', async () => {
    const compiler = await compile(readFileSync('src/index.css', 'utf8'), {
      base: path.resolve('src'),
      onDependency: () => {},
    });
    const classes = USER_COLOR_NAMES.flatMap(n =>
      Object.values(userColorClasses(n))
    );
    const css = compiler.build(classes);
    for (const n of USER_COLOR_NAMES) {
      expect(css).toMatch(
        new RegExp(
          `\\.bg-user-${n}-container\\s*\\{[^}]*var\\(--md-custom-color-${n}-container\\)`
        )
      );
      expect(css).toMatch(
        new RegExp(
          `\\.text-on-user-${n}\\s*\\{[^}]*var\\(--md-custom-color-on-${n}\\)`
        )
      );
    }
  });
});
