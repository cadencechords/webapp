// The M3 color scheme behind src/styles/color-tokens.css: every role as a
// --md-sys-color-* custom property, light on :root and dark on .dark.
// Regenerate with `yarn tokens:color` after changing the seed or variant.
import {
  argbFromHex,
  customColor,
  hexFromArgb,
  Hct,
  MaterialDynamicColors,
  SchemeTonalSpot,
  TonalPalette,
} from '@material/material-color-utilities';

export const SEED = '#1f6feb'; // current brand blue
const SPEC_VERSION = '2025';
const CONTRAST_LEVEL = 0; // M3 default

// [css name, MaterialDynamicColors key]
export const ROLES = [
  ...['primary', 'secondary', 'tertiary'].flatMap(c => {
    const C = c[0].toUpperCase() + c.slice(1);
    return [
      [c, c],
      [`on-${c}`, `on${C}`],
      [`${c}-container`, `${c}Container`],
      [`on-${c}-container`, `on${C}Container`],
      [`${c}-fixed`, `${c}Fixed`],
      [`${c}-fixed-dim`, `${c}FixedDim`],
      [`on-${c}-fixed`, `on${C}Fixed`],
      [`on-${c}-fixed-variant`, `on${C}FixedVariant`],
    ];
  }),
  ['error', 'error'],
  ['on-error', 'onError'],
  ['error-container', 'errorContainer'],
  ['on-error-container', 'onErrorContainer'],
  ['background', 'background'],
  ['on-background', 'onBackground'],
  ['surface', 'surface'],
  ['surface-dim', 'surfaceDim'],
  ['surface-bright', 'surfaceBright'],
  ['surface-container-lowest', 'surfaceContainerLowest'],
  ['surface-container-low', 'surfaceContainerLow'],
  ['surface-container', 'surfaceContainer'],
  ['surface-container-high', 'surfaceContainerHigh'],
  ['surface-container-highest', 'surfaceContainerHighest'],
  ['on-surface', 'onSurface'],
  ['surface-variant', 'surfaceVariant'],
  ['on-surface-variant', 'onSurfaceVariant'],
  ['surface-tint', 'surfaceTint'],
  ['outline', 'outline'],
  ['outline-variant', 'outlineVariant'],
  ['inverse-surface', 'inverseSurface'],
  ['inverse-on-surface', 'inverseOnSurface'],
  ['inverse-primary', 'inversePrimary'],
  ['scrim', 'scrim'],
  ['shadow', 'shadow'],
];

export function generateScheme(isDark) {
  const scheme = new SchemeTonalSpot(
    Hct.fromInt(argbFromHex(SEED)),
    isDark,
    CONTRAST_LEVEL,
    SPEC_VERSION
  );
  return Object.fromEntries(
    ROLES.map(([name, key]) => [
      name,
      hexFromArgb(MaterialDynamicColors[key].getArgb(scheme)),
    ])
  );
}

// Colors users pick for binders, notes and events are stored by name. Stored
// values never change; this maps each name to an M3 color group (M3 custom
// color tones) at render time. Sources are the Tailwind v2 500 shades the app
// has always shown.
//
// Not harmonized: pulling hues toward the blue primary collapses purple and
// indigo into blue and pink into purple, and these colors exist to tell items
// apart. Gray and black use near-neutral palettes (the custom color algorithm
// would boost gray to a saturated blue).
export const USER_COLORS = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#10b981',
  yellow: '#f59e0b',
  pink: '#ec4899',
  purple: '#8b5cf6',
  indigo: '#6366f1',
  gray: '#6b7280',
  black: '#000000',
};

// { light: { color, 'on-color', container, 'on-container' }, dark: {...} }
export function generateUserColor(name) {
  const pick = ({ color, onColor, colorContainer, onColorContainer }) => ({
    color: hexFromArgb(color),
    'on-color': hexFromArgb(onColor),
    container: hexFromArgb(colorContainer),
    'on-container': hexFromArgb(onColorContainer),
  });
  const fromPalette = (palette, light, dark) => {
    const tones = ([c, on, cont, onCont]) =>
      pick({
        color: palette.tone(c),
        onColor: palette.tone(on),
        colorContainer: palette.tone(cont),
        onColorContainer: palette.tone(onCont),
      });
    return { light: tones(light), dark: tones(dark) };
  };
  const source = Hct.fromInt(argbFromHex(USER_COLORS[name]));

  // Black inverts in dark mode, like black annotations already do.
  if (name === 'black')
    return fromPalette(
      TonalPalette.fromHueAndChroma(source.hue, 2),
      [10, 100, 90, 10],
      [90, 10, 30, 90]
    );
  // M3 custom color tones: color 40/80, on-color 100/20, container 90/30, on-container 10/90.
  if (name === 'gray')
    return fromPalette(
      TonalPalette.fromHueAndChroma(source.hue, 6),
      [40, 100, 90, 10],
      [80, 20, 30, 90]
    );
  const group = customColor(argbFromHex(SEED), {
    name,
    value: source.toInt(),
    blend: false,
  });
  return { light: pick(group.light), dark: pick(group.dark) };
}

function userColorVars(theme) {
  return Object.keys(USER_COLORS).flatMap(name => {
    const c = generateUserColor(name)[theme];
    return [
      `  --md-custom-color-${name}: ${c.color};`,
      `  --md-custom-color-on-${name}: ${c['on-color']};`,
      `  --md-custom-color-${name}-container: ${c.container};`,
      `  --md-custom-color-on-${name}-container: ${c['on-container']};`,
    ];
  });
}

export function renderCss() {
  const block = (selector, colors) =>
    `${selector} {\n${Object.entries(colors)
      .map(([n, v]) => `  --md-sys-color-${n}: ${v};`)
      .join('\n')}\n}\n`;
  return (
    `/* Generated by scripts/generate-color-tokens.mjs — do not edit by hand.\n` +
    `   Seed ${SEED}, TonalSpot, spec ${SPEC_VERSION}, contrast ${CONTRAST_LEVEL}. */\n\n` +
    block(':root', generateScheme(false)) +
    '\n' +
    block('.dark', generateScheme(true)) +
    '\n' +
    `/* User-picked data colors (binders, notes, events). See USER_COLORS. */\n` +
    `:root {\n${userColorVars('light').join('\n')}\n}\n\n.dark {\n${userColorVars('dark').join('\n')}\n}\n\n` +
    `/* Tailwind utilities for every role: bg-primary-container, text-on-surface-variant, ... */\n` +
    `@theme inline {\n${ROLES.map(([n]) => `  --color-${n}: var(--md-sys-color-${n});`).join('\n')}\n` +
    `\n  /* bg-user-blue, text-on-user-blue-container, ... */\n` +
    Object.keys(USER_COLORS)
      .map(n =>
        [
          `  --color-user-${n}: var(--md-custom-color-${n});`,
          `  --color-on-user-${n}: var(--md-custom-color-on-${n});`,
          `  --color-user-${n}-container: var(--md-custom-color-${n}-container);`,
          `  --color-on-user-${n}-container: var(--md-custom-color-on-${n}-container);`,
        ].join('\n')
      )
      .join('\n') +
    `\n}\n`
  );
}
