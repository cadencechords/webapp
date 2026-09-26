# Design tokens (Material 3 Expressive)

Foundations for the M3 Expressive redesign. Tokens are CSS custom properties
(`--md-sys-*`) exposed as Tailwind utilities. They are all imported from
`src/index.css`. See them rendered at **`/dev/tokens`**. That route isn't
linked from the nav and is lazy-loaded.

Existing screens still use the pinned Tailwind v2 palette (`gray-*`, `blue-*`,
`dark-gray-*`, …) until they're migrated.

## Color (`src/styles/color-tokens.css`, generated)

Every M3 role, generated from the brand blue `#1f6feb` with
`@material/material-color-utilities` (TonalSpot, 2025 spec, default
contrast). Light values are on `:root` and dark values on `.dark`, so the
`ThemeProvider` class toggle switches them.

- Utilities: `bg-primary`, `text-on-primary-container`, `bg-surface-container-high`, `border-outline-variant`, `bg-scrim/50`, …
- Regenerate: change the seed or variant in `scripts/color-tokens.mjs`, then run `yarn tokens:color`.
  A test fails if the checked-in file is out of date. Another test checks that every on-X/X pair meets 4.5:1.

## User colors (binders, notes, events)

Users pick colors by name (`red`, `blue`, `green`, `yellow`, `pink`,
`purple`, `indigo`, `gray`, `black`, and `none` for binders). The stored
values never change. `userColorClasses(name)` in `src/utils/userColors.ts`
maps each name to `color`, `onColor`, `container` and `onContainer` Tailwind
classes, for example `bg-user-blue-container text-on-user-blue-container`.
Anything unknown falls back to neutral roles.

- The groups are generated from the v2 500 shades the app has always shown,
  using M3 custom color tones in light and dark (`USER_COLORS` in
  `scripts/color-tokens.mjs`).
- **They are not harmonized.** Pulling them toward the blue primary merges
  purple and indigo into blue and pink into purple, and these colors exist to
  tell items apart. A test keeps the chromatic ones at least 10° apart.
- Gray and black use near-neutral palettes. Black inverts in dark mode, as
  black annotations already do.
- **Annotations don't change.** Their stored RGBA values still render as-is
  (`getThemeAwareAnnotationColor` only swaps black and white by theme). Only
  picker swatches get restyled.
- The mobile app also renders these stored names. It should use the same
  source shades so both platforms show a similar hue.

## Typography (`src/styles/type-tokens.css`, generated)

The M3 type scale (androidx `TypeScaleTokens.kt`) in Roboto Flex. Each style
has an `-emphasized` variant that is one weight heavier (400 → 500, 500 → 700).

- Utilities: `text-display-large` … `text-label-small`, and `text-title-medium-emphasized` etc.
  Each sets size, line height, tracking and weight. `font-plain` / `font-brand` set the family.
- Tokens: `--md-sys-typescale-<role>-<size>[-emphasized]-{font,weight,size,line-height,tracking}`.
- Regenerate: edit `scripts/type-tokens.mjs`, then run `yarn tokens:type`.

## Shape, elevation, state layers (`src/styles/shape-elevation-state.css`)

| What          | Utilities                                                                                                                                                                                       | Notes                                                                                                                                |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Corner radius | `rounded-extra-small` (4) · `small` (8) · `medium` (12) · `large` (16) · `large-increased` (20) · `extra-large` (28) · `extra-large-increased` (32) · `extra-extra-large` (48) · `rounded-full` | M3 names; Tailwind's `rounded-sm/md/lg` are unchanged                                                                                |
| Elevation     | `elevation-0` … `elevation-5`                                                                                                                                                                   | Surface-container tone plus the level's shadow                                                                                       |
| State layer   | `state-layer`                                                                                                                                                                                   | `currentColor` overlay at 8% hover, 10% focus, 10% pressed, 16% dragged (`data-dragging`). Uses `::before`, drawn behind the content |
| Focus ring    | `focus-ring`                                                                                                                                                                                    | 3px `secondary` outline, 2px offset, on `:focus-visible`                                                                             |

## Motion (`src/styles/motion.css`, `src/utils/spring.ts`)

M3 Expressive uses **spatial** springs for position, size and corners (these
may overshoot) and **effects** springs for color and opacity (these don't).
Each comes in fast, default and slow.

| Token           | Curve                               | Duration |
| --------------- | ----------------------------------- | -------- |
| fast-spatial    | `cubic-bezier(0.42,1.67,0.21,0.90)` | 350ms    |
| default-spatial | `cubic-bezier(0.38,1.21,0.22,1.00)` | 500ms    |
| slow-spatial    | `cubic-bezier(0.39,1.29,0.35,0.98)` | 650ms    |
| fast-effects    | `cubic-bezier(0.31,0.94,0.34,1.00)` | 150ms    |
| default-effects | `cubic-bezier(0.34,0.80,0.34,1.00)` | 200ms    |
| slow-effects    | `cubic-bezier(0.34,0.88,0.34,1.00)` | 300ms    |

- **CSS transitions:** `transition-<speed>-spatial` (transform, translate,
  size, inset, border-radius) and `transition-<speed>-effects` (colors,
  opacity, shadow). There are also separate `ease-<token>` and
  `duration-<token>` utilities.
- **Shape morph:** `shape-morph` squares the corners while pressed or
  selected (`aria-pressed`, `aria-selected`, `data-selected`). Set
  `--shape-morph-to` to change the target radius.
- **Springs, for interruptible or gesture motion:** use `createSpring` from
  `src/utils/spring.ts`. It's a small integrator with the androidx
  `ExpressiveMotionTokens` damping and stiffness values (`SPRINGS.fastSpatial`
  and so on), and has no dependencies. Retargeting mid-flight keeps the
  velocity, so a sheet can be flung and caught.
- **Reduced motion:** with `prefers-reduced-motion`, spatial durations become
  0 and spatial springs jump to their target. Effects (fades, color changes)
  still animate.
