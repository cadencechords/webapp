// /dev/components: a fixture page for the shared components as they're
// restyled to M3 Expressive. Not linked from the nav; used to review every
// variant and state in one place, in both themes.
import { useState } from 'react';
import type { ReactNode } from 'react';

import Button from '../../components/Button';
import type {
  ButtonColor,
  ButtonSize,
  ButtonVariant,
} from '../../components/Button';
import ButtonGroup from '../../components/ButtonGroup';
import SegmentedControl from '../../components/SegmentedControl';
import ButtonSwitch from '../../components/buttons/ButtonSwitch';
import IconButton from '../../components/buttons/IconButton';
import MobileMenuButton from '../../components/buttons/MobileMenuButton';
import AddCancelActions from '../../components/buttons/AddCancelActions';
import Icon from '../../components/Icon';

const VARIANTS: [ButtonVariant, string][] = [
  ['filled', 'Filled'],
  ['accent', 'Tonal'],
  ['outlined', 'Outlined'],
  ['open', 'Text'],
];
const COLORS: ButtonColor[] = [
  'blue',
  'red',
  'purple',
  'gray',
  'black',
  'white',
  'green',
  'yellow',
  'indigo',
  'pink',
];
const SIZES: ButtonSize[] = ['xs', 'sm', 'small', 'md', 'medium'];

function Section({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-headline-small font-plain text-on-surface">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-3">
      <span className="w-24 text-label-medium text-on-surface-variant">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function ComponentsPage() {
  const [styles, setStyles] = useState<string[]>(['bold']);
  const [segment, setSegment] = useState('General');
  const [quality, setQuality] = useState('Major');

  return (
    <div className="min-h-screen p-6 bg-surface text-on-surface font-plain">
      <h1 className="mb-2 text-display-small">Components</h1>
      <p className="mb-10 text-body-large text-on-surface-variant">
        Shared components in M3 Expressive. Hover, press, or Tab to see state
        layers, the press morph and the focus ring. Toggle the app theme to
        check dark mode.
      </p>

      <Section title="Buttons">
        {VARIANTS.map(([variant, label]) => (
          <Row key={variant} label={label}>
            {COLORS.map(color => (
              <Button key={color} variant={variant} color={color}>
                {color}
              </Button>
            ))}
            <Button variant={variant} disabled>
              disabled
            </Button>
            <Button variant={variant} loading>
              loading
            </Button>
          </Row>
        ))}
        <Row label="Sizes">
          {SIZES.map(size => (
            <Button key={size} size={size}>
              {size}
            </Button>
          ))}
          <Button full={false} size="md" variant="accent">
            Tonal M
          </Button>
        </Row>
        <Row label="Icon">
          {(['sm', 'md', 'lg'] as const).map(size => (
            <Button
              key={size}
              variant="icon"
              color="gray"
              size={size}
              name={`Delete ${size}`}
            >
              <Icon name="delete" className="w-6 h-6" />
            </Button>
          ))}
          <Button variant="icon" color="blue" name="Add">
            <Icon name="add" className="w-6 h-6" />
          </Button>
          <Button variant="icon" disabled name="Disabled">
            <Icon name="delete" className="w-6 h-6" />
          </Button>
          <IconButton color="blue">
            <Icon name="add" className="h-7 w-7" />
          </IconButton>
        </Row>
        <Row label="Actions">
          <div className="w-80">
            <AddCancelActions />
          </div>
        </Row>
        <Row label="Menu">
          <div className="w-56 py-2 rounded-large bg-surface-container">
            <MobileMenuButton full className="text-left">
              Edit
            </MobileMenuButton>
            <MobileMenuButton full color="red" className="text-left">
              Delete
            </MobileMenuButton>
            <MobileMenuButton full disabled className="text-left">
              Disabled
            </MobileMenuButton>
          </div>
        </Row>
      </Section>

      <Section title="Connected button groups">
        <div className="space-y-4 max-w-md">
          <ButtonGroup
            options={[
              { value: 'bold', display: <b>B</b> },
              { value: 'italic', display: <i>I</i> },
            ]}
            selected={styles}
            onChange={({ selected, option }) =>
              setStyles(s =>
                selected
                  ? [...s, option.value]
                  : s.filter(v => v !== option.value)
              )
            }
          />
          <SegmentedControl
            name="components-md"
            options={['General', 'Chords', 'Lyrics']}
            selected={segment}
            onChange={setSegment}
          />
          <SegmentedControl
            name="components-sm"
            size="sm"
            options={['General', 'Chords', 'Lyrics']}
            selected={segment}
            onChange={setSegment}
          />
          <ButtonSwitch
            buttonLabels={['Major', 'Minor']}
            activeButtonLabel={quality}
            onClick={setQuality}
          />
        </div>
      </Section>
    </div>
  );
}
