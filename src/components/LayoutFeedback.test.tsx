import { fireEvent, render, screen, within } from '@testing-library/react';
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
import PageTitle from './PageTitle';
import PasswordRequirements from './PasswordRequirements';
import ScrollIcon from '../icons/ScrollIcon';
import SectionTitle from './SectionTitle';
import SessionIcon from '../icons/SessionIcon';
import StackedList from './StackedList';
import StyledDialog from './StyledDialog';
import StyledPopover from './StyledPopover';
import TableRow from './TableRow';
import TeamLoginOptions from './TeamLoginOptions';
import { EDIT_SONGS } from '../utils/constants';
import type { Song } from '../types';

afterEach(() => {
  vi.restoreAllMocks();
});

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

test('Alert defaults to blue (secondary-container) and not dismissable', () => {
  const { container } = render(<Alert>Hi</Alert>);
  expect(container.firstElementChild).toHaveClass('bg-secondary-container');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('StyledDialog defaults to md, fullscreen, with a close button and no underline', () => {
  render(
    <StyledDialog open onCloseDialog={() => {}} title="Title">
      <p>Body</p>
    </StyledDialog>
  );
  const panel = screen.getByText('Body').closest('.inline-block');
  expect(panel).toHaveClass(
    'sm:max-w-md',
    'min-h-screen',
    'sm:rounded-extra-large',
    'bg-surface',
    'sm:bg-surface-container-high'
  );
  expect(within(panel as HTMLElement).getByRole('button')).toBeInTheDocument();
  expect(screen.getByRole('heading').className).not.toContain('border-b');
  expect(screen.getByText('Body').parentElement).toHaveClass('pt-0', 'pb-6');
});

test('PageTitle defaults to a left-aligned, read-only title', () => {
  render(<PageTitle title="Songs" />);
  const title = screen.getByRole('heading');
  // justify-start: the old justify-left/-right weren't Tailwind classes.
  expect(title).toHaveClass(
    'justify-start',
    'text-headline-small-emphasized',
    'text-on-surface'
  );
  expect(title.className).not.toContain('undefined');
});

test('PasswordRequirements defaults to unmet', () => {
  const { container } = render(<PasswordRequirements />);
  expect(container.querySelectorAll('li')).toHaveLength(2);
  expect(container.querySelector('svg.text-primary')).toBeNull();
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

test('AutoscrollSheet has no stray classes', () => {
  const { container } = renderWithProvider(
    <AutoscrollSheet song={song} onSongChange={() => {}} />,
    { preloadedState: member }
  );
  expect(container.firstElementChild?.className).toBe(' ');
  // The floating shortcut appears once scrolling starts.
  userEvent.click(screen.getByRole('button', { name: 'Start auto scroll' }));
  const shortcut = container.querySelector('.fixed.flex-center');
  expect(shortcut?.className).toBe('fixed flex-center flex-col z-10 ');
});

test('AutoscrollSheet shows a pause and stop shortcut while scrolling', () => {
  vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(42);
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  renderWithProvider(<AutoscrollSheet song={song} onSongChange={() => {}} />, {
    preloadedState: member,
  });
  userEvent.click(screen.getByRole('button', { name: 'Start auto scroll' }));
  expect(
    screen.getAllByRole('button', { name: 'Pause auto scroll' })
  ).toHaveLength(2);

  // The shortcut's pause leaves it showing, to resume from.
  userEvent.click(
    screen.getAllByRole('button', { name: 'Pause auto scroll' })[1]
  );
  expect(
    screen.getByRole('button', { name: 'Resume auto scroll' })
  ).toHaveAttribute('aria-pressed', 'false');

  userEvent.click(screen.getByRole('button', { name: 'Stop auto scroll' }));
  expect(
    screen.queryByRole('button', { name: 'Stop auto scroll' })
  ).not.toBeInTheDocument();
});

test('AutoscrollSheet stops scrolling when another song is shown', () => {
  const requestFrame = vi
    .spyOn(window, 'requestAnimationFrame')
    .mockReturnValue(42);
  const cancelFrame = vi
    .spyOn(window, 'cancelAnimationFrame')
    .mockImplementation(() => {});
  const { rerender } = renderWithProvider(
    <AutoscrollSheet song={song} onSongChange={() => {}} />,
    { preloadedState: member }
  );
  // The sheet's play/pause toggle (the shortcut's comes after it).
  const toggle = () =>
    screen.getAllByRole('button', { name: /auto scroll$/ })[0]!;

  userEvent.click(toggle());
  expect(requestFrame).toHaveBeenCalledTimes(1);
  expect(cancelFrame).not.toHaveBeenCalledWith(42);

  rerender(
    <AutoscrollSheet
      song={{ ...song, id: song.id + 1 }}
      onSongChange={() => {}}
    />
  );
  expect(cancelFrame).toHaveBeenCalledWith(42);

  // No longer scrolling, so the toggle starts again rather than stopping.
  userEvent.click(toggle());
  expect(requestFrame).toHaveBeenCalledTimes(2);
});

test('AutoscrollSheet drops an unsaved speed change when another song is shown', () => {
  const editor = {
    auth: {
      currentUser: {
        id: 1,
        role: { permissions: [{ name: EDIT_SONGS }] },
      },
    },
  };
  const { container, rerender } = renderWithProvider(
    <AutoscrollSheet song={song} onSongChange={() => {}} />,
    { preloadedState: editor }
  );

  fireEvent.change(container.querySelector('input[type="range"]')!, {
    target: { value: '3' },
  });
  expect(screen.getByText('Save changes')).toBeInTheDocument();

  rerender(
    <AutoscrollSheet
      song={{ ...song, id: song.id + 1 }}
      onSongChange={() => {}}
    />
  );
  expect(screen.queryByText('Save changes')).not.toBeInTheDocument();
});

test('AutoscrollSheet steps the speed between 1 and 10, with the slider', () => {
  const onSongChange = vi.fn<(field: 'scroll_speed', value: number) => void>();
  const { rerender } = renderWithProvider(
    <AutoscrollSheet
      song={{ ...song, scroll_speed: 3 }}
      onSongChange={onSongChange}
    />,
    { preloadedState: member }
  );
  expect(
    screen.getByRole('heading', { name: 'Auto scroll' })
  ).toBeInTheDocument();
  expect(screen.getByText('Speed').previousElementSibling).toHaveTextContent(
    '3'
  );
  userEvent.click(screen.getByRole('button', { name: 'Faster' }));
  expect(onSongChange).toHaveBeenLastCalledWith('scroll_speed', 4);
  userEvent.click(screen.getByRole('button', { name: 'Slower' }));
  expect(onSongChange).toHaveBeenLastCalledWith('scroll_speed', 2);

  rerender(
    <AutoscrollSheet
      song={{ ...song, scroll_speed: 10 }}
      onSongChange={onSongChange}
    />
  );
  expect(screen.getByRole('button', { name: 'Faster' })).toBeDisabled();
  rerender(
    <AutoscrollSheet
      song={{ ...song, scroll_speed: 1 }}
      onSongChange={onSongChange}
    />
  );
  expect(screen.getByRole('button', { name: 'Slower' })).toBeDisabled();
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
  ['AddStickyNoteIcon', () => <AddStickyNoteIcon />],
  ['ScrollIcon', () => <ScrollIcon />],
  ['SessionIcon', () => <SessionIcon />],
])('%s renders an empty class', (_, renderComponent) => {
  const { container } = render(renderComponent());
  expect(container.firstElementChild).toHaveAttribute('class', '');
});

test('StackedList has only its list class by default', () => {
  const { container } = render(<StackedList />);
  expect(container.firstElementChild).toHaveAttribute(
    'class',
    'list-segmented'
  );
});
