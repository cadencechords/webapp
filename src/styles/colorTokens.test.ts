import { readFileSync } from 'node:fs';
import { generateScheme, renderCss } from '../../scripts/color-tokens.mts';

// Text on the surfaces is body text: WCAG AA's 4.5:1. The accent roles come
// from the mobile app's hand-tuned palette (scripts/color-tokens.mts), which
// sits between 3:1 and 4.5:1 in places, so they're held to 3:1 (AA for large
// text and UI parts).
const BODY = 4.5;
const ACCENT = 3;

const PAIRS = [
  ['on-primary', 'primary', ACCENT],
  ['on-primary-container', 'primary-container', ACCENT],
  ['on-secondary', 'secondary', ACCENT],
  ['on-secondary-container', 'secondary-container', ACCENT],
  ['on-tertiary', 'tertiary', ACCENT],
  ['on-tertiary-container', 'tertiary-container', ACCENT],
  ['on-error', 'error', ACCENT],
  ['on-error-container', 'error-container', ACCENT],
  ['on-primary-fixed', 'primary-fixed', ACCENT],
  ['on-primary-fixed-variant', 'primary-fixed', ACCENT],
  ['on-surface', 'surface', BODY],
  ['on-surface', 'surface-container-highest', BODY],
  ['on-surface-variant', 'surface', BODY],
  ['on-surface-variant', 'surface-container-highest', BODY],
  ['inverse-on-surface', 'inverse-surface', BODY],
] as const;

// WCAG 2 contrast ratio between two #rrggbb colors.
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

test('checked-in color-tokens.css matches the generator (run yarn tokens:color)', () => {
  const file = readFileSync('src/styles/color-tokens.css', 'utf8');
  expect(file).toBe(renderCss());
});

describe.each([
  ['light', false],
  ['dark', true],
])('%s scheme', (_, isDark) => {
  const scheme = generateScheme(isDark);

  test.each(PAIRS)('%s on %s meets %s:1', (fg, bg, min) => {
    expect(contrast(scheme[fg], scheme[bg])).toBeGreaterThanOrEqual(min);
  });
});
