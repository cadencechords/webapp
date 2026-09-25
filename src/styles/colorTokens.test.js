import { readFileSync } from 'node:fs';
import { generateScheme, renderCss } from '../../scripts/color-tokens.mjs';

const PAIRS = [
  ['on-primary', 'primary'], ['on-primary-container', 'primary-container'],
  ['on-secondary', 'secondary'], ['on-secondary-container', 'secondary-container'],
  ['on-tertiary', 'tertiary'], ['on-tertiary-container', 'tertiary-container'],
  ['on-error', 'error'], ['on-error-container', 'error-container'],
  ['on-primary-fixed', 'primary-fixed'], ['on-primary-fixed-variant', 'primary-fixed'],
  ['on-surface', 'surface'], ['on-surface', 'surface-container-highest'],
  ['on-surface-variant', 'surface'], ['on-surface-variant', 'surface-container-highest'],
  ['inverse-on-surface', 'inverse-surface'],
];

// WCAG 2 contrast ratio between two #rrggbb colors.
function contrast(a, b) {
  const lum = hex => {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test('checked-in color-tokens.css matches the generator (run yarn tokens:color)', () => {
  const file = readFileSync('src/styles/color-tokens.css', 'utf8');
  expect(file).toBe(renderCss());
});

describe.each([['light', false], ['dark', true]])('%s scheme', (_, isDark) => {
  const scheme = generateScheme(isDark);

  test.each(PAIRS)('%s on %s meets 4.5:1', (fg, bg) => {
    expect(contrast(scheme[fg], scheme[bg])).toBeGreaterThanOrEqual(4.5);
  });
});
