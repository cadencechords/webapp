// /dev/tokens: a fixture page for the M3 design tokens. Not linked from the
// nav; used to review colors, type, shape, elevation and state layers.
import { useState } from 'react';

import { ROLES, SEED, generateScheme } from '../../../scripts/color-tokens.mjs';
import { SCALE } from '../../../scripts/type-tokens.mjs';
import { USER_COLOR_NAMES, userColorClasses } from '../../utils/userColors';

// Class names below are built dynamically; index.css safelists them with @source inline().
const SHAPES = [
  'extra-small',
  'small',
  'medium',
  'large',
  'large-increased',
  'extra-large',
  'extra-large-increased',
  'extra-extra-large',
  'full',
];
const SCHEMES = { light: generateScheme(false), dark: generateScheme(true) };

function Section({ title, children }) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-headline-small font-plain text-on-surface">
        {title}
      </h2>
      {children}
    </section>
  );
}

// Swatches use the generated values directly, so light and dark show side by
// side whatever the current theme is.
function ColorScheme({ name }) {
  const scheme = SCHEMES[name];
  return (
    <div>
      <h3 className="mb-2 text-title-medium font-plain text-on-surface">
        {name}
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {ROLES.map(([role]) => {
          const on =
            scheme[`on-${role}`] ??
            (role.startsWith('on-') ? scheme[role.slice(3)] : null);
          return (
            <div
              key={role}
              className="p-3 border rounded-medium border-outline-variant"
              style={{
                backgroundColor: scheme[role],
                color: on ?? (name === 'dark' ? '#fff' : '#000'),
              }}
            >
              <div className="text-label-large font-plain">{role}</div>
              <div className="font-mono text-label-small">{scheme[role]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TokensPage() {
  const [dragging, setDragging] = useState(false);
  const [moved, setMoved] = useState(false);
  const [selected, setSelected] = useState(false);

  return (
    <div className="min-h-screen p-6 bg-surface text-on-surface font-plain">
      <h1 className="mb-2 text-display-small">Design tokens</h1>
      <p className="mb-10 text-body-large text-on-surface-variant">
        M3 Expressive tokens. Seed {SEED}, TonalSpot. Toggle the app theme to
        see the live tokens switch.
      </p>

      <Section title="Color">
        <div className="grid gap-8 xl:grid-cols-2">
          <ColorScheme name="light" />
          <ColorScheme name="dark" />
        </div>
      </Section>

      <Section title="User colors">
        <p className="mb-4 text-body-medium text-on-surface-variant">
          Stored binder, note and event colors, as they render in the current
          theme.
        </p>
        <div className="flex flex-wrap gap-3">
          {[...USER_COLOR_NAMES, 'none'].map(name => {
            const c = userColorClasses(name);
            return (
              <div
                key={name}
                className={`w-32 overflow-hidden rounded-medium ${c.container} ${c.onContainer}`}
              >
                <div
                  className={`px-3 py-2 text-label-large ${c.color} ${c.onColor}`}
                >
                  {name}
                </div>
                <div className="px-3 py-2 text-body-small">container</div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Type scale">
        <div className="space-y-3">
          {SCALE.map(([role, size]) => (
            <div
              key={`${role}-${size}`}
              className="flex flex-wrap items-baseline gap-x-6"
            >
              <span className={`text-${role}-${size}`}>
                {role} {size}
              </span>
              <span className={`text-${role}-${size}-emphasized`}>
                emphasized
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Shape">
        <div className="flex flex-wrap gap-4">
          {SHAPES.map(shape => (
            <div key={shape} className="text-center">
              <div
                className={`w-24 h-24 bg-primary-container rounded-${shape}`}
              />
              <div className="mt-1 text-label-medium text-on-surface-variant">
                {shape}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Elevation">
        <div className="flex flex-wrap gap-6 p-6 bg-surface-container-low rounded-large">
          {[0, 1, 2, 3, 4, 5].map(level => (
            <div
              key={level}
              className={`w-28 h-20 flex-center rounded-medium elevation-${level} text-label-large`}
            >
              level {level}
            </div>
          ))}
        </div>
      </Section>

      <Section title="State layers and focus">
        <p className="mb-4 text-body-medium text-on-surface-variant">
          Hover, press, or Tab to focus. The last button toggles the dragged
          state.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-2.5 state-layer focus-ring rounded-full bg-primary text-on-primary text-label-large">
            Filled
          </button>
          <button className="px-6 py-2.5 state-layer focus-ring rounded-full bg-secondary-container text-on-secondary-container text-label-large">
            Tonal
          </button>
          <button className="px-6 py-2.5 state-layer focus-ring rounded-full border border-outline text-primary text-label-large">
            Outlined
          </button>
          <button
            data-dragging={dragging || undefined}
            onClick={() => setDragging(d => !d)}
            className="px-6 py-2.5 state-layer focus-ring rounded-medium elevation-1 text-on-surface text-label-large"
          >
            {dragging ? 'Dragging' : 'Drag me'}
          </button>
        </div>
      </Section>

      <Section title="Motion">
        <div className="flex flex-wrap items-center gap-6">
          <button
            onClick={() => setMoved(m => !m)}
            className="px-6 py-2.5 state-layer focus-ring rounded-full bg-primary text-on-primary text-label-large"
          >
            Move (default spatial)
          </button>
          <div className="relative h-12 w-72 rounded-full bg-surface-container-high">
            <div
              className={`absolute top-1 left-1 h-10 w-10 rounded-full bg-tertiary transition-default-spatial ${
                moved ? 'translate-x-60' : 'translate-x-0'
              }`}
            />
          </div>
          <button
            aria-pressed={selected}
            onClick={() => setSelected(s => !s)}
            className="px-6 py-2.5 shape-morph state-layer focus-ring rounded-full bg-secondary-container text-on-secondary-container text-label-large"
          >
            Shape morph {selected ? '(selected)' : ''}
          </button>
        </div>
      </Section>
    </div>
  );
}
