import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProvider } from '../utils/test';
import AddStickyNoteIcon from '../icons/AddStickyNoteIcon';
import Alert from './Alert';
import AutoscrollSheet from './AutoscrollSheet';
import BottomSheet from './BottomSheet';
import CalendarCell from './calendar/CalendarCell';
import Card from './Card';
import DragAndDropTable from './DragAndDropTable';
import MetronomeSheet from './MetronomeSheet';
import MobileHeader from './MobileHeader';
import NotesDragDropContext from './NotesDragDropContext';
import PageTitle from './PageTitle';
import PasswordRequirements from './PasswordRequirements';
import ScrollIcon from '../icons/ScrollIcon';
import SectionTitle from './SectionTitle';
import SelectedPcoSongsTable from './SelectedPcoSongsTable';
import SessionIcon from '../icons/SessionIcon';
import StackedList from './StackedList';
import StyledDialog from './StyledDialog';
import StyledPopover from './StyledPopover';
import Table from './Table';
import TableRow from './TableRow';
import TeamLoginOptions from './TeamLoginOptions';
import type { Song } from '../types';

// These pin the defaults that used to live in defaultProps (CAD-120).

vi.mock('../api/notesApi');
vi.mock('./Note', () => ({
  default: ({ isDragDisabled }: { isDragDisabled: boolean }) => (
    <div data-testid="note" data-drag-disabled={String(isDragDisabled)} />
  ),
}));

const song = {
  id: 1,
  name: 'Amazing Grace',
  format: {},
} as Song;
const member = { auth: { currentUser: { id: 1, role: { permissions: [] } } } };

test('Alert defaults to blue and not dismissable', () => {
  const { container } = render(<Alert>Hi</Alert>);
  expect(container.firstElementChild).toHaveClass('bg-blue-100');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('StyledDialog defaults to md, fullscreen, bordered, with a close button', () => {
  render(
    <StyledDialog open onCloseDialog={() => {}} title="Title">
      <p>Body</p>
    </StyledDialog>
  );
  const panel = screen.getByText('Body').closest('.inline-block');
  expect(panel).toHaveClass('sm:max-w-md', 'min-h-screen', 'sm:rounded-xl');
  expect(within(panel as HTMLElement).getByRole('button')).toBeInTheDocument();
  expect(screen.getByRole('heading')).toHaveClass('border-b');
  expect(screen.getByText('Body').parentElement).toHaveClass('py-4');
});

test('PageTitle defaults to a left-aligned, read-only title', () => {
  render(<PageTitle title="Songs" />);
  const title = screen.getByRole('heading');
  expect(title).toHaveClass('justify-left');
  expect(title.className).not.toContain('undefined');
});

test('MobileHeader shows the add button by default', () => {
  render(<MobileHeader title="Songs" />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

test('PasswordRequirements defaults to unmet', () => {
  const { container } = render(<PasswordRequirements />);
  expect(container.querySelectorAll('svg.text-red-600')).toHaveLength(2);
  expect(container.querySelector('svg.text-green-600')).toBeNull();
});

test('TableRow is not removable by default', () => {
  render(
    <table>
      <tbody>
        <TableRow columns={['a']} />
      </tbody>
    </table>
  );
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('list components render with no data', () => {
  render(<Table />);
  expect(screen.getByRole('table').querySelectorAll('tbody tr')).toHaveLength(
    0
  );
  render(<SelectedPcoSongsTable onRemove={() => {}} />);
  renderWithProvider(
    <MemoryRouter>
      <TeamLoginOptions />
    </MemoryRouter>
  );
  expect(screen.getByText('Choose a team to login to')).toBeInTheDocument();
});

test('DragAndDropTable defaults to rearrangeable rows without remove buttons', () => {
  const { container, rerender } = render(
    <MemoryRouter>
      <DragAndDropTable items={[song]} />
    </MemoryRouter>
  );
  expect(container.querySelector('[data-rbd-draggable-id="1"]')).not.toBeNull();
  // The draggable row itself has role="button"; the remove button is a <button>.
  expect(container.querySelector('button')).toBeNull();
  rerender(
    <MemoryRouter>
      <DragAndDropTable />
    </MemoryRouter>
  );
  expect(container.querySelector('[data-rbd-draggable-id]')).toBeNull();
});

test('NotesDragDropContext defaults to rearrangeable notes', () => {
  render(
    <NotesDragDropContext
      song={{
        ...song,
        notes: [{ id: 5, content: '', color: 'yellow', line_number: 0 }],
      }}
      onAddTempNote={() => {}}
      onReplaceTempNote={() => {}}
      onUpdateNote={() => {}}
      onDeleteNote={() => {}}
    />
  );
  expect(screen.getByTestId('note')).toHaveAttribute(
    'data-drag-disabled',
    'false'
  );
});

test('AutoscrollSheet has no stray classes', () => {
  const { container } = renderWithProvider(
    <AutoscrollSheet song={song} onSongChange={() => {}} />,
    { preloadedState: member }
  );
  expect(container.firstElementChild?.className).toBe(' ');
  // The floating shortcut appears once scrolling starts.
  userEvent.click(container.querySelector('button') as HTMLElement);
  const shortcut = container.querySelector('.fixed.flex-center');
  expect(shortcut?.className).toBe('fixed flex-center flex-col z-10 ');
});

test('MetronomeSheet has no stray class', () => {
  const { container } = renderWithProvider(
    <MetronomeSheet song={song} onSongChange={() => {}} />,
    { preloadedState: member }
  );
  expect(container.firstElementChild).toHaveAttribute('class', '');
});

test('StyledPopover has no stray class', () => {
  render(
    <StyledPopover button="Open" position="bottom">
      Content
    </StyledPopover>
  );
  userEvent.click(screen.getByRole('button'));
  expect(screen.getByText('Content').className).not.toContain('undefined');
});

// className defaults to '' so these don't render "undefined" as a class.
test.each<[string, () => JSX.Element]>([
  ['BottomSheet', () => <BottomSheet />],
  ['Card', () => <Card />],
  ['SectionTitle', () => <SectionTitle title="Title" />],
  ['CalendarCell', () => <CalendarCell />],
  [
    'CalendarCell with a date',
    () => (
      <CalendarCell
        date={{ fullDate: new Date(), dateNumber: 1, isToday: false }}
      />
    ),
  ],
])('%s has no stray class', (_, renderComponent) => {
  const { container } = render(renderComponent());
  for (const element of container.querySelectorAll('[class]')) {
    expect(element.getAttribute('class')).not.toContain('undefined');
  }
});

// With className undefined, React leaves the class attribute out entirely.
test.each<[string, () => JSX.Element]>([
  ['StackedList', () => <StackedList />],
  ['AddStickyNoteIcon', () => <AddStickyNoteIcon />],
  ['ScrollIcon', () => <ScrollIcon />],
  ['SessionIcon', () => <SessionIcon />],
])('%s renders an empty class', (_, renderComponent) => {
  const { container } = render(renderComponent());
  expect(container.firstElementChild).toHaveAttribute('class', '');
});
