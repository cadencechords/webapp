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
import type {
  ColorGroup,
  DynamicScheme,
} from '@material/material-color-utilities';

export const SEED = '#1f6feb'; // current brand blue
const SPEC_VERSION = '2025';
const CONTRAST_LEVEL = 0; // M3 default

// [css name, MaterialDynamicColors key]
export const ROLES = [
  ...(['primary', 'secondary', 'tertiary'] as const).flatMap(c => {
    // c[0].toUpperCase() + c.slice(1) is exactly what Capitalize<> describes.
    const C = (c[0].toUpperCase() + c.slice(1)) as Capitalize<typeof c>;
    return [
      [c, c],
      [`on-${c}`, `on${C}`],
      [`${c}-container`, `${c}Container`],
      [`on-${c}-container`, `on${C}Container`],
      [`${c}-fixed`, `${c}Fixed`],
      [`${c}-fixed-dim`, `${c}FixedDim`],
      [`on-${c}-fixed`, `on${C}Fixed`],
      [`on-${c}-fixed-variant`, `on${C}FixedVariant`],
    ] as const;
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
] as const;

type RoleKey = (typeof ROLES)[number][1];

// The mobile app's palette (app/src/constants/Colors.ts, MATERIAL_LIGHT_COLORS
// and MATERIAL_DARK_COLORS), so web and mobile share one set of colors. It's
// hand-tuned rather than generated, and wins over the scheme from SEED.
const APP_LIGHT: Partial<Record<RoleKey, string>> = {
  primary: '#009bd4',
  surfaceTint: '#009bd4',
  onPrimary: '#ffffff',
  primaryContainer: '#c6e7ff',
  onPrimaryContainer: '#003e57',
  secondary: '#7b43ad',
  onSecondary: '#ffffff',
  secondaryContainer: '#deb7ff',
  onSecondaryContainer: '#541886',
  tertiary: '#5755a5',
  onTertiary: '#ffffff',
  tertiaryContainer: '#aaa8ff',
  onTertiaryContainer: '#3c3988',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  background: '#ffffff',
  onBackground: '#171c20',
  surface: '#fbf9f9',
  onSurface: '#1b1b1c',
  surfaceVariant: '#d9e4ed',
  onSurfaceVariant: '#3e4850',
  outline: '#6e7881',
  outlineVariant: '#bdc8d1',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#303031',
  inverseOnSurface: '#f3f0f0',
  inversePrimary: '#81cfff',
  primaryFixed: '#c6e7ff',
  onPrimaryFixed: '#001e2d',
  primaryFixedDim: '#81cfff',
  onPrimaryFixedVariant: '#004c6b',
  secondaryFixed: '#f1dbff',
  onSecondaryFixed: '#2d0050',
  secondaryFixedDim: '#deb7ff',
  onSecondaryFixedVariant: '#612993',
  tertiaryFixed: '#e2dfff',
  onTertiaryFixed: '#110860',
  tertiaryFixedDim: '#c3c0ff',
  onTertiaryFixedVariant: '#3f3d8c',
  surfaceDim: '#dcd9da',
  surfaceBright: '#fbf9f9',
  surfaceContainerLowest: '#f5f9fc',
  surfaceContainerLow: '#eef3f7',
  surfaceContainer: '#e7edf2',
  surfaceContainerHigh: '#dde5eb',
  surfaceContainerHighest: '#d2dce3',
};
const APP_DARK: Partial<Record<RoleKey, string>> = {
  primary: '#81cfff',
  surfaceTint: '#81cfff',
  onPrimary: '#00344b',
  primaryContainer: '#00aeee',
  onPrimaryContainer: '#003e57',
  secondary: '#deb7ff',
  onSecondary: '#49067b',
  secondaryContainer: '#e08be8',
  onSecondaryContainer: '#72006b',
  tertiary: '#bebbff',
  onTertiary: '#232070',
  tertiaryContainer: '#9c99ff',
  onTertiaryContainer: '#322f90',
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',
  background: '#0f1418',
  onBackground: '#dee3e8',
  surface: '#131314',
  onSurface: '#e4e2e2',
  surfaceVariant: '#3e4850',
  onSurfaceVariant: '#bdc8d1',
  outline: '#87929b',
  outlineVariant: '#3e4850',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#e4e2e2',
  inverseOnSurface: '#303031',
  inversePrimary: '#00658c',
  primaryFixed: '#c6e7ff',
  onPrimaryFixed: '#001e2d',
  primaryFixedDim: '#81cfff',
  onPrimaryFixedVariant: '#004c6b',
  secondaryFixed: '#f1dbff',
  onSecondaryFixed: '#2d0050',
  secondaryFixedDim: '#deb7ff',
  onSecondaryFixedVariant: '#612993',
  tertiaryFixed: '#e2dfff',
  onTertiaryFixed: '#110860',
  tertiaryFixedDim: '#c3c0ff',
  onTertiaryFixedVariant: '#3f3d8c',
  surfaceDim: '#11121a',
  surfaceBright: '#353a46',
  surfaceContainerLowest: '#0b0c12',
  surfaceContainerLow: '#171a22',
  surfaceContainer: '#1b1e27',
  surfaceContainerHigh: '#252933',
  surfaceContainerHighest: '#303542',
};

export function generateScheme(isDark: boolean): Record<string, string> {
  // SchemeTonalSpot extends DynamicScheme, but its .d.ts imports that without
  // a file extension, which NodeNext resolution (tsconfig.node.json) can't
  // follow, so the base class is lost there.
  const scheme = new SchemeTonalSpot(
    Hct.fromInt(argbFromHex(SEED)),
    isDark,
    CONTRAST_LEVEL,
    SPEC_VERSION
  ) as DynamicScheme;
  const app = isDark ? APP_DARK : APP_LIGHT;
  return Object.fromEntries(
    ROLES.map(([name, key]) => [
      name,
      app[key] ?? hexFromArgb(MaterialDynamicColors[key].getArgb(scheme)),
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
export const USER_COLORS: Record<string, string> = {
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

type UserColorTones = {
  color: string;
  'on-color': string;
  container: string;
  'on-container': string;
};
// Tones for [color, on-color, container, on-container].
type Tones = [number, number, number, number];

// { light: { color, 'on-color', container, 'on-container' }, dark: {...} }
export function generateUserColor(name: string): {
  light: UserColorTones;
  dark: UserColorTones;
} {
  const pick = ({
    color,
    onColor,
    colorContainer,
    onColorContainer,
  }: ColorGroup): UserColorTones => ({
    color: hexFromArgb(color),
    'on-color': hexFromArgb(onColor),
    container: hexFromArgb(colorContainer),
    'on-container': hexFromArgb(onColorContainer),
  });
  const fromPalette = (palette: TonalPalette, light: Tones, dark: Tones) => {
    const tones = ([c, on, cont, onCont]: Tones) =>
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

function userColorVars(theme: 'light' | 'dark') {
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

export function renderCss(): string {
  const block = (selector: string, colors: Record<string, string>) =>
    `${selector} {\n${Object.entries(colors)
      .map(([n, v]) => `  --md-sys-color-${n}: ${v};`)
      .join('\n')}\n}\n`;
  return (
    `/* Generated by scripts/generate-color-tokens.mts — do not edit by hand.\n` +
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
