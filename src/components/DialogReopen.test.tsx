import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import type { AxiosResponse } from 'axios';
import AddSongsToSetDialog from './AddSongsToSetDialog';
import ChangeSetlistDateDialog from './ChangeSetlistDateDialog';
import KeyChooserDialog from './KeyChooserDialog';
import KeyTransposerDialog from './KeyTransposerDialog';
import MeterDialog from './MeterDialog';
import PrintSongDialog from './PrintSongDialog';
import EventDetailDialog from '../dialogs/EventDetailDialog';
import NoteDialog, { type NoteUpdates } from '../dialogs/NoteDialog';
import SongApi from '../api/SongApi';
import type { CalendarEvent, Song } from '../types';

// Pins how the dialogs fixed in CAD-143 start when they open and reopen, now
// that they no longer reset their state in an effect.

vi.mock('@react-pdf/renderer', async importOriginal => ({
  ...(await importOriginal<typeof import('@react-pdf/renderer')>()),
  usePDF: () => [
    { url: null, blob: null, loading: true, error: null },
    () => {},
  ],
}));
// The sheet needs the store and event form; these tests read only the title.
vi.mock('./EventDetailSheet', () => ({ default: () => null }));

// headlessui's Dialog can use ResizeObserver, which jsdom doesn't have.
beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/**
 * Renders `dialog(open)` open, closes it, waits for its contents to unmount,
 * and opens it again.
 */
async function reopen(
  dialog: (open: boolean) => ReactElement,
  rerender: (ui: ReactElement) => void
) {
  rerender(dialog(false));
  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
  rerender(dialog(true));
}

test('KeyChooserDialog drops an unconfirmed pick when reopened', async () => {
  const dialog = (open: boolean) => (
    <KeyChooserDialog
      open={open}
      onCloseDialog={() => {}}
      currentSongKey="Am"
      onChange={() => {}}
    />
  );
  const { rerender } = render(dialog(true));
  fireEvent.click(screen.getByText('D'));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dm');

  await reopen(dialog, rerender);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Am');
});

test('KeyChooserDialog opens on the key it was given since', async () => {
  const dialog = (open: boolean, songKey?: string) => (
    <KeyChooserDialog
      open={open}
      onCloseDialog={() => {}}
      currentSongKey={songKey}
      onChange={() => {}}
    />
  );
  const { rerender } = render(dialog(true));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('G');

  await reopen(open => dialog(open, 'Eb'), rerender);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Eb');
});

test('KeyTransposerDialog drops an unconfirmed pick when reopened', async () => {
  const onChange = vi.fn<(key: string | null) => void>();
  const dialog = (open: boolean, transposedKey = 'D') => (
    <KeyTransposerDialog
      open={open}
      onCloseDialog={() => {}}
      originalKey="C"
      transposedKey={transposedKey}
      onChange={onChange}
    />
  );
  const { rerender } = render(dialog(true));
  fireEvent.click(screen.getByText('E'));

  await reopen(dialog, rerender);
  fireEvent.click(screen.getByText('Confirm'));
  expect(onChange).toHaveBeenLastCalledWith('D');

  await reopen(open => dialog(open, 'F'), rerender);
  fireEvent.click(screen.getByText('Confirm'));
  expect(onChange).toHaveBeenLastCalledWith('F');
});

test('MeterDialog reopens on the meter, not an unconfirmed edit', async () => {
  const dialog = (open: boolean) => (
    <MeterDialog
      open={open}
      meter="6/8"
      onMeterChange={() => {}}
      onCloseDialog={() => {}}
    />
  );
  const { rerender } = render(dialog(true));
  fireEvent.click(screen.getByText('12'));
  expect(screen.getAllByRole('spinbutton')[0]).toHaveValue(12);

  await reopen(dialog, rerender);
  const [numerator, denominator] = screen.getAllByRole('spinbutton');
  expect(numerator).toHaveValue(6);
  expect(denominator).toHaveValue(8);
});

test('ChangeSetlistDateDialog reopens on the scheduled date', async () => {
  const dialog = (open: boolean) => (
    <MemoryRouter initialEntries={['/sets/7']}>
      <Route path="/sets/:id">
        <ChangeSetlistDateDialog
          open={open}
          onCloseDialog={() => {}}
          scheduledDate="2026-09-26T12:00:00"
          onDateChanged={() => {}}
        />
      </Route>
    </MemoryRouter>
  );
  const { rerender } = render(dialog(true));
  // OutlinedInput's label isn't tied to its input. Non-null: the dialog is
  // open whenever this is called.
  const input = () => document.getElementById('date-picker')!;
  expect(input()).toHaveValue('2026-09-26');
  fireEvent.change(input(), { target: { value: '2026-10-01' } });
  expect(input()).toHaveValue('2026-10-01');
  expect(screen.getByText('Update date').closest('button')).toBeEnabled();

  await reopen(dialog, rerender);
  expect(input()).toHaveValue('2026-09-26');
  expect(screen.getByText('Update date').closest('button')).toBeDisabled();
});

test('NoteDialog reopens on the note, not an unconfirmed edit', async () => {
  const onUpdate = vi.fn<(updates: NoteUpdates) => void>();
  // One note object, so only reopening can reset the dialog.
  const slowDown = { content: 'Slow down', color: 'blue' };
  const dialog = (open: boolean, note = slowDown) => (
    <NoteDialog
      open={open}
      note={note}
      onCloseDialog={() => {}}
      onUpdate={onUpdate}
      onDelete={() => {}}
    />
  );
  const { rerender } = render(dialog(true));
  const textarea = () => screen.getByPlaceholderText('Type here');
  expect(textarea()).toHaveValue('Slow down');
  fireEvent.change(textarea(), { target: { value: 'Speed up' } });
  // The color options have no text; pink is the one with a pink background.
  fireEvent.click(document.querySelector('button.bg-pink-200')!);

  await reopen(dialog, rerender);
  expect(textarea()).toHaveValue('Slow down');
  fireEvent.click(screen.getByText('Confirm'));
  expect(onUpdate).toHaveBeenLastCalledWith({ content: 'Slow down' });

  await reopen(
    open => dialog(open, { content: 'Build', color: 'blue' }),
    rerender
  );
  expect(textarea()).toHaveValue('Build');
  fireEvent.click(screen.getByText('Confirm'));
  expect(onUpdate).toHaveBeenCalledWith({ content: 'Build' });
});

const printedSong: Song = {
  id: 1,
  name: 'Amazing Grace',
  content: 'A\nAmazing grace',
  original_key: 'A',
  format: { font: 'Open Sans', font_size: 14, bold_chords: false },
};

test('PrintSongDialog keeps its settings when reopened, until the song changes', async () => {
  const dialog = (open: boolean, song = printedSong) => (
    <PrintSongDialog open={open} onCloseDialog={() => {}} song={song} />
  );
  const { rerender } = render(dialog(true));
  const boldChords = () =>
    within(
      screen.getByText('Bold chords').parentElement as HTMLElement
    ).getByRole('checkbox');
  fireEvent.click(boldChords());
  expect(boldChords()).toBeChecked();

  await reopen(dialog, rerender);
  expect(boldChords()).toBeChecked();

  rerender(dialog(true, { ...printedSong }));
  expect(boldChords()).not.toBeChecked();
});

const calendarEvent = (fields: Partial<CalendarEvent>) =>
  // As: the dialog's title reads only these fields.
  ({ id: 1, title: 'Rehearsal', ...fields }) as CalendarEvent;

test('EventDetailDialog shows only the times the event has', () => {
  const dialog = (event: CalendarEvent) => (
    <EventDetailDialog
      open
      event={event}
      onCloseDialog={() => {}}
      onDeleted={() => {}}
    />
  );
  const { rerender } = render(
    dialog(
      calendarEvent({
        start_time: '2026-09-26T18:00:00',
        end_time: '2026-09-26T20:30:00',
      })
    )
  );
  expect(screen.getByText(/\(6:00pm-8:30pm\)/)).toBeInTheDocument();

  rerender(dialog(calendarEvent({ start_time: '2026-09-27T00:00:00' })));
  expect(screen.getByText('September 27, 2026')).toBeInTheDocument();
  expect(screen.queryByText(/pm/)).not.toBeInTheDocument();
});

test('AddSongsToSetDialog filters the unbound songs by the query', async () => {
  const song = (id: number, name: string) => ({ id, name }) as Song;
  vi.spyOn(SongApi, 'getAll').mockResolvedValue({
    data: [song(1, 'Bound'), song(2, 'Amazing Grace'), song(3, 'Holy')],
  } as AxiosResponse<Song[]>);
  render(
    <MemoryRouter initialEntries={['/sets/7']}>
      <Route path="/sets/:id">
        <AddSongsToSetDialog
          open
          onCloseDialog={() => {}}
          onAdded={() => {}}
          boundSongs={[song(1, 'Bound')]}
        />
      </Route>
    </MemoryRouter>
  );
  expect(await screen.findByText('Amazing Grace')).toBeInTheDocument();
  expect(screen.getByText('Holy')).toBeInTheDocument();
  expect(screen.queryByText('Bound')).not.toBeInTheDocument();

  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hol' } });
  expect(screen.getByText('Holy')).toBeInTheDocument();
  expect(screen.queryByText('Amazing Grace')).not.toBeInTheDocument();
});
