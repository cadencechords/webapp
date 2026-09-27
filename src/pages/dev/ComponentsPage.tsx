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
import OutlinedInput from '../../components/inputs/OutlinedInput';
import WellInput from '../../components/inputs/WellInput';
import OpenInput from '../../components/inputs/OpenInput';
import EditableData from '../../components/inputs/EditableData';
import TimeInput from '../../components/inputs/TimeInput';
import Label from '../../components/Label';
import FileInput from '../../components/FileInput';
import SearchBar from '../../components/SearchBar';
import Checkbox from '../../components/Checkbox';
import Toggle from '../../components/Toggle';
import Range from '../../components/Range';
import Select from '../../components/Select';
import StyledListBox from '../../components/StyledListBox';
import ColorPicker from '../../components/ColorPicker';
import StyledDialog from '../../components/StyledDialog';
import ConfirmDeleteDialog from '../../dialogs/ConfirmDeleteDialog';
import Drawer from '../../components/Drawer';
import BottomSheet from '../../components/BottomSheet';
import StyledPopover from '../../components/StyledPopover';
import { MenuDivider, MenuItem, MenuList } from '../../components/Menu';
import Card from '../../components/Card';
import { Tab } from '@headlessui/react';
import { PrimaryTab, PrimaryTabs } from '../../components/tabs/PrimaryTabs';
import Badge from '../../components/Badge';
import KeyBadge from '../../components/KeyBadge';
import DetailTag from '../../components/DetailTag';
import NumberBadge from '../../components/NumberBadge';
import ProfilePicture from '../../components/ProfilePicture';
import TableHead from '../../components/TableHead';
import TableRow from '../../components/TableRow';
import {
  LIST_ITEM,
  LIST_ITEM_INTERACTIVE,
  LIST_ITEM_TWO_LINE,
  LIST_SUPPORTING_TEXT,
} from '../../components/lists/listItem';

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
const LIST_OPTIONS = ['Member', 'Leader', 'Admin'].map((role, index) => ({
  value: index,
  template: role,
}));
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('worship@example.com');
  const [query, setQuery] = useState('');
  const [inline, setInline] = useState('Amazing Grace');
  const [checked, setChecked] = useState(true);
  const [unchecked, setUnchecked] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [disabledToggle, setDisabledToggle] = useState(false);
  const [speed, setSpeed] = useState(4);
  const [font, setFont] = useState('Roboto Mono');
  const [color, setColor] = useState('rgba(31, 111, 235, 1)');
  const [listOption, setListOption] = useState(LIST_OPTIONS[0]);
  const [dialog, setDialog] = useState<
    'basic' | 'fullscreen' | 'delete' | 'drawer' | 'sheet' | 'menu' | null
  >(null);
  // ConfirmDeleteDialog stays loading after a confirm, as it does in the
  // app (callers close it for good), so reopening it here shows that state.
  const closeDialog = () => setDialog(null);

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

      <Section title="Text fields">
        <div className="grid max-w-3xl gap-6 md:grid-cols-2">
          <OutlinedInput label="Name" value={name} onChange={setName} />
          <OutlinedInput
            label="Email"
            value={email}
            onChange={setEmail}
            supportingText="We'll send the invite here"
          />
          <OutlinedInput
            label="Search"
            placeholder="Song title"
            value=""
            onChange={() => {}}
            error="Couldn't find that song"
          />
          <OutlinedInput
            label="Scheduled date"
            type="date"
            value=""
            onChange={() => {}}
          />
          <OutlinedInput
            label="Add a new theme"
            button="Create"
            value=""
            onChange={() => {}}
          />
          <OutlinedInput placeholder="No label" value="" onChange={() => {}} />
          <WellInput value={query} onChange={setQuery} />
          <TimeInput defaultValue="7:30 PM" />
          <div>
            <Label>Open input</Label>
            <OpenInput
              placeholder="Search songs"
              value={query}
              onChange={setQuery}
            />
          </div>
          <div>
            <Label>Editable data</Label>
            <EditableData value={inline} onChange={setInline} />
          </div>
          <FileInput onChange={() => {}} onRemove={() => {}} />
        </div>
        <div className="mt-6 -ml-5">
          <SearchBar />
        </div>
      </Section>

      <Section title="Selection controls">
        <div className="grid max-w-3xl gap-8 md:grid-cols-2">
          <Row label="Checkbox">
            <Checkbox checked={checked} onChange={setChecked} />
            <Checkbox checked={unchecked} onChange={setUnchecked} />
            <Checkbox checked color="green" onChange={() => {}} />
            <Checkbox checked color="pink" onChange={() => {}} />
          </Row>
          <div className="space-y-4">
            <Toggle
              label="Autosize"
              enabled={enabled}
              onChange={setEnabled}
              spacing="between"
            />
            <Toggle
              label="Show roadmap"
              enabled={disabledToggle}
              onChange={setDisabledToggle}
              spacing="between"
            />
          </div>
          <div className="pt-12">
            <Range
              min={1}
              max={10}
              step={1}
              value={speed}
              onChange={setSpeed}
            />
          </div>
          <div className="w-40">
            <Select
              options={['Roboto Mono', 'Open Sans', 'Courier'].map(f => ({
                value: f,
                display: f,
              }))}
              selected={font}
              onChange={setFont}
              className="h-8"
            />
          </div>
          <div className="w-56">
            <StyledListBox
              options={LIST_OPTIONS}
              selectedOption={listOption}
              onChange={value =>
                setListOption(LIST_OPTIONS.find(o => o.value === value)!)
              }
            />
          </div>
          <Row label="Color">
            <ColorPicker color={color} onChange={setColor} />
          </Row>
        </div>
      </Section>

      <Section title="Dialogs and sheets">
        <div className="flex flex-wrap gap-3">
          <Button variant="accent" onClick={() => setDialog('basic')}>
            Basic dialog
          </Button>
          <Button variant="accent" onClick={() => setDialog('fullscreen')}>
            Full-screen dialog
          </Button>
          <Button variant="accent" onClick={() => setDialog('delete')}>
            Confirm delete
          </Button>
          <Button variant="accent" onClick={() => setDialog('drawer')}>
            Side sheet
          </Button>
          <Button variant="accent" onClick={() => setDialog('sheet')}>
            Bottom sheet
          </Button>
          <Button variant="accent" onClick={() => setDialog('menu')}>
            Menu in a dialog
          </Button>
        </div>
        <StyledDialog
          open={dialog === 'basic' || dialog === 'fullscreen'}
          onCloseDialog={closeDialog}
          title="Create a setlist"
          fullscreen={dialog === 'fullscreen'}
        >
          <div className="space-y-4">
            <OutlinedInput label="Name" value="" onChange={() => {}} />
            <OutlinedInput
              label="Scheduled date"
              type="date"
              value=""
              onChange={() => {}}
            />
            <AddCancelActions onCancel={closeDialog} onAdd={closeDialog} />
          </div>
        </StyledDialog>
        <ConfirmDeleteDialog
          show={dialog === 'delete'}
          onCloseDialog={closeDialog}
          onCancel={closeDialog}
          onConfirm={closeDialog}
        />
        <Drawer open={dialog === 'drawer'} onClose={closeDialog}>
          <div className="p-4 text-title-medium">Adjustments</div>
        </Drawer>
        <BottomSheet open={dialog === 'sheet'} onClose={closeDialog}>
          <div className="p-6 pt-16 text-body-large">A bottom sheet</div>
        </BottomSheet>
        <StyledDialog
          open={dialog === 'menu'}
          onCloseDialog={closeDialog}
          title="Profile Picture"
          fullscreen={false}
        >
          <MenuList className="-mx-3 *:rounded-medium">
            <MenuItem
              onClick={closeDialog}
              icon={<Icon name="desktop_windows" />}
            >
              Upload from device
            </MenuItem>
            <MenuItem
              destructive
              onClick={closeDialog}
              icon={<Icon name="delete" />}
            >
              Remove photo
            </MenuItem>
          </MenuList>
        </StyledDialog>
      </Section>

      <Section title="Menus">
        <div className="flex flex-wrap items-start gap-6">
          {(['bottom-start', 'bottom-end', 'top'] as const).map(position => (
            <div key={position}>
              <StyledPopover
                position={position}
                button={<Button variant="accent">{position}</Button>}
              >
                <MenuList className="w-60">
                  <MenuItem icon={<Icon name="print" />}>Print</MenuItem>
                  <MenuItem
                    icon={<Icon name="edit" />}
                    trailing={<Icon name="check" className="w-5 h-5" />}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem icon={<Icon name="download" />} disabled>
                    Download (disabled)
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem destructive icon={<Icon name="delete" />}>
                    Delete
                  </MenuItem>
                </MenuList>
              </StyledPopover>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Lists, cards and chips">
        <Row label="List">
          <div className="w-full max-w-md list-segmented">
            <div
              className={`${LIST_ITEM} ${LIST_ITEM_INTERACTIVE}`}
              tabIndex={0}
            >
              <span className="min-w-0 truncate">Amazing Grace</span>
              <KeyBadge songKey="G" />
            </div>
            <div
              className={`${LIST_ITEM_TWO_LINE} ${LIST_ITEM_INTERACTIVE}`}
              tabIndex={0}
            >
              <div className="min-w-0">
                <div className="truncate">Sunday morning</div>
                <div className={LIST_SUPPORTING_TEXT}>
                  5 songs · Sun Oct 4, 2026
                </div>
              </div>
            </div>
            <div
              className={`${LIST_ITEM} ${LIST_ITEM_INTERACTIVE}`}
              tabIndex={0}
              data-dragging
            >
              Being dragged
            </div>
          </div>
        </Row>
        <Row label="Cards">
          <div className="grid w-full max-w-2xl grid-cols-3 gap-4">
            <Card>Filled</Card>
            <Card variant="elevated">Elevated</Card>
            <Card variant="outlined">Outlined</Card>
            <Card onClick={() => {}}>Filled, clickable</Card>
          </div>
        </Row>
        <Row label="Table">
          <table className="w-full max-w-2xl">
            <TableHead columns={['EMAIL', 'SENT', '']} />
            <tbody>
              <TableRow
                columns={['ada@example.com', 'Sun Sep 27 2026']}
                removable
                onRemove={() => {}}
              />
              <TableRow columns={['grace@example.com', 'Sat Sep 26 2026']} />
            </tbody>
          </table>
        </Row>
        <Row label="Chips">
          <div className="flex flex-wrap items-center gap-3">
            <KeyBadge songKey="Bb" />
            <DetailTag>Hymn</DetailTag>
            <Badge className="">Default</Badge>
            <Badge color="green" className="">
              Trialing
            </Badge>
            <NumberBadge className="">3</NumberBadge>
            <NumberBadge className="" disabled>
              12
            </NumberBadge>
          </div>
        </Row>
        <Row label="Avatars">
          <div className="flex items-center gap-3">
            <ProfilePicture name="Ada Lovelace" size="xs" />
            <ProfilePicture name="grace@example.com" size="sm" />
            <ProfilePicture name="Cadence" />
            <ProfilePicture size="sm" />
          </div>
        </Row>
      </Section>

      <Section title="Tabs">
        <Tab.Group as="div" className="max-w-xl">
          <PrimaryTabs>
            <PrimaryTab>Details</PrimaryTab>
            <PrimaryTab>Reminders</PrimaryTab>
            <PrimaryTab>Set</PrimaryTab>
          </PrimaryTabs>
          <Tab.Panels className="py-4 text-body-medium text-on-surface-variant">
            <Tab.Panel>Details panel</Tab.Panel>
            <Tab.Panel>Reminders panel</Tab.Panel>
            <Tab.Panel>Set panel</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Section>
    </div>
  );
}
