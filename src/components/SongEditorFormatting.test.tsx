import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import type { AxiosResponse } from 'axios';
import AddGenreDialog from './AddGenreDialog';
import BoldItalicButtonGroup from './BoldItalicButtonGroup';
import EditorFormatOptions from './EditorFormatOptions';
import FormatPanelChordOptions from './FormatPanelChordOptions';
import FormatPreview from './FormatPreview';
import MeterDialog from './MeterDialog';
import PrintSongDialog from './PrintSongDialog';
import SongPreferencesForm from './SongPreferencesForm';
import TransposedKeyField from './TransposedKeyField';
import SongEditorProvider from '../contexts/SongEditorProvider';
import useSongEditor from '../hooks/useSongEditor';
import useSongForm from '../hooks/forms/useSongForm';
import FormatApi from '../api/FormatApi';
import GenreApi from '../api/GenreApi';
import SongApi from '../api/SongApi';
import type { Song, Tag } from '../types';

// Pins the behavior of the song editor, formatting and song field files
// converted in CAD-130.

// The PDF itself isn't rendered in jsdom: the dialog gets no url yet, as it
// does while the PDF renders.
vi.mock('@react-pdf/renderer', async importOriginal => ({
  ...(await importOriginal<typeof import('@react-pdf/renderer')>()),
  usePDF: () => [
    { url: null, blob: null, loading: true, error: null },
    () => {},
  ],
}));

/** An axios response carrying `data`; the code under test reads only that. */
function response<T>(data: T) {
  return { data } as AxiosResponse<T>;
}

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

test('BoldItalicButtonGroup selects the set styles and reports toggles', () => {
  const onChange = vi.fn();
  const { container } = render(
    <BoldItalicButtonGroup isBold isItalic={false} onChange={onChange} />
  );
  const [bold, italic] = container.querySelectorAll('button');
  expect(bold).toHaveClass('bg-gray-700');
  expect(italic).not.toHaveClass('bg-gray-700');

  fireEvent.click(bold);
  expect(onChange).toHaveBeenLastCalledWith('bold_chords', false);
  fireEvent.click(italic);
  expect(onChange).toHaveBeenLastCalledWith('italic_chords', true);
});

test('EditorFormatOptions renders nothing while hidden', () => {
  const { container } = render(
    <EditorFormatOptions show={false} onClose={() => {}} />
  );
  expect(container).toBeEmptyDOMElement();
});

const editorSong: Song = {
  id: 1,
  name: 'Amazing Grace',
  content: 'G\nAmazing grace',
  format: { font: 'Open Sans', bold_chords: false },
};

/** Renders the editor for `song` (passed as location state) and `children`. */
function renderEditor(song: Song, children?: React.ReactNode) {
  const editor: { current?: ReturnType<typeof useSongEditor> } = {};
  function Probe() {
    editor.current = useSongEditor();
    return null;
  }
  render(
    <MemoryRouter
      initialEntries={[{ pathname: `/songs/${song.id}/edit`, state: song }]}
    >
      <Route path="/songs/:id/edit">
        <SongEditorProvider>
          <Probe />
          {children}
        </SongEditorProvider>
      </Route>
    </MemoryRouter>
  );
  return editor;
}

test('useSongEditor edits the song and saves the content and format', async () => {
  const updateSong = vi
    .spyOn(SongApi, 'updateOneById')
    .mockResolvedValue(response(editorSong));
  const updateFormat = vi
    .spyOn(FormatApi, 'updateSongFormat')
    .mockResolvedValue(response(editorSong.format));
  const editor = renderEditor(editorSong);
  expect(editor.current?.song).toEqual(editorSong);
  expect(editor.current?.dirty).toBe(false);

  act(() => {
    editor.current?.updateFormat({ bold_chords: true });
    editor.current?.updateContent('D\nHow sweet');
  });
  expect(editor.current?.song).toEqual({
    ...editorSong,
    content: 'D\nHow sweet',
    format: { font: 'Open Sans', bold_chords: true },
  });
  expect(editor.current?.dirty).toBe(true);

  await act(async () => {
    await editor.current?.saveChanges();
  });
  expect(updateSong).toHaveBeenCalledWith(1, { content: 'D\nHow sweet' });
  expect(updateFormat).toHaveBeenCalledWith(1, { bold_chords: true });
  expect(editor.current?.dirty).toBe(false);
  expect(editor.current?.saving).toBe(false);
});

test('the chord options update the edited format', () => {
  const editor = renderEditor(editorSong, <FormatPanelChordOptions />);
  const [bold] = screen.getAllByRole('button');
  fireEvent.click(bold);
  expect(editor.current?.song?.format).toEqual({
    font: 'Open Sans',
    bold_chords: true,
  });
  expect(editor.current?.dirty).toBe(true);
});

test('useSongForm is valid once named, and clears', () => {
  const form: { current?: ReturnType<typeof useSongForm> } = {};
  function Probe() {
    form.current = useSongForm();
    return null;
  }
  render(<Probe />);
  expect(form.current?.isValid).toBe(false);
  act(() => form.current?.onChange('name', 'Amazing Grace'));
  expect(form.current?.form).toEqual({ name: 'Amazing Grace' });
  expect(form.current?.isValid).toBe(true);
  act(() => form.current?.clearForm());
  expect(form.current?.form).toEqual({ name: '' });
});

test('MeterDialog starts from the song meter and confirms the edit', () => {
  const onMeterChange = vi.fn();
  const onCloseDialog = vi.fn();
  render(
    <MeterDialog
      open
      meter="6/8"
      onMeterChange={onMeterChange}
      onCloseDialog={onCloseDialog}
    />
  );
  const [numerator, denominator] = screen.getAllByRole('spinbutton');
  expect(numerator).toHaveValue(6);
  expect(denominator).toHaveValue(8);

  fireEvent.change(numerator, { target: { value: '12' } });
  fireEvent.click(screen.getByText('Confirm'));
  expect(onMeterChange).toHaveBeenCalledWith('12/8');
  expect(onCloseDialog).toHaveBeenCalled();
});

test('MeterDialog without a meter starts at 4/4', () => {
  const onMeterChange = vi.fn();
  render(
    <MeterDialog open onMeterChange={onMeterChange} onCloseDialog={() => {}} />
  );
  fireEvent.click(screen.getByText('Confirm'));
  expect(onMeterChange).toHaveBeenCalledWith('4/4');
});

test('TransposedKeyField steps from the transposed key, else the original', () => {
  const onChange = vi.fn();
  const { container, rerender } = render(
    <TransposedKeyField originalKey="G" transposedKey="A" onChange={onChange} />
  );
  const halfStepButtons = () =>
    container.querySelectorAll(':scope > div > button');
  fireEvent.click(halfStepButtons()[0]);
  expect(onChange).toHaveBeenLastCalledWith('Bb');
  fireEvent.click(halfStepButtons()[1]);
  expect(onChange).toHaveBeenLastCalledWith('Ab');

  rerender(<TransposedKeyField originalKey="G" onChange={onChange} />);
  fireEvent.click(halfStepButtons()[0]);
  expect(onChange).toHaveBeenLastCalledWith('Ab');

  rerender(<TransposedKeyField onChange={onChange} />);
  expect(halfStepButtons()[0]).toBeDisabled();
  expect(halfStepButtons()[1]).toBeDisabled();
});

test('AddGenreDialog offers the unbound genres and adds the picked ones', async () => {
  const rock: Tag = { id: 1, name: 'Rock' };
  const gospel: Tag = { id: 2, name: 'Gospel' };
  const hymn: Tag = { id: 3, name: 'Hymn' };
  vi.spyOn(GenreApi, 'getAll').mockResolvedValue(
    response([rock, gospel, hymn])
  );
  const addGenres = vi
    .spyOn(SongApi, 'addGenres')
    .mockResolvedValue(response([hymn]));
  const onGenresAdded = vi.fn();
  const onCloseDialog = vi.fn();
  render(
    <AddGenreDialog
      open
      currentSong={{ id: 5, genres: [gospel] }}
      onCloseDialog={onCloseDialog}
      onGenresAdded={onGenresAdded}
    />
  );

  fireEvent.click(await screen.findByText('Hymn'));
  expect(screen.getByText('Rock')).toBeInTheDocument();
  expect(screen.queryByText('Gospel')).not.toBeInTheDocument();

  fireEvent.click(screen.getByText('Add'));
  await waitFor(() => expect(onGenresAdded).toHaveBeenCalledWith([hymn]));
  expect(addGenres).toHaveBeenCalledWith(5, [3]);
  expect(onCloseDialog).toHaveBeenCalled();
});

test('PrintSongDialog offers the song keys, with the capo number', () => {
  render(
    <PrintSongDialog
      open
      onCloseDialog={() => {}}
      song={{
        id: 1,
        name: 'Amazing Grace',
        content: 'A\nAmazing grace',
        original_key: 'A',
        capo: { id: 1, capo_key: 'G' },
        format: { font: 'Open Sans', font_size: 14 },
      }}
    />
  );
  const keySelect = screen.getByLabelText('Key');
  expect(keySelect).toHaveValue('capo');
  expect(
    [...keySelect.querySelectorAll('option')].map(option => option.textContent)
  ).toEqual(['Original (A)', 'Capo 2 (G)', 'Hide chords']);
  expect(screen.getByText('Download').closest('a')).not.toHaveAttribute('href');
});

test('FormatPreview picks its preset, and unpicks it once selected', () => {
  const preset = { id: 3, name: 'Big', font_size: 20 };
  const onChange = vi.fn();
  const { rerender } = render(
    <FormatPreview format={preset} selected={false} onChange={onChange} />
  );
  fireEvent.click(screen.getByRole('button'));
  expect(onChange).toHaveBeenLastCalledWith(preset);

  rerender(<FormatPreview format={preset} selected onChange={onChange} />);
  fireEvent.click(screen.getByRole('button'));
  expect(onChange).toHaveBeenLastCalledWith(null);
});

test('SongPreferencesForm reports hiding chords when unchecked', () => {
  const onChange = vi.fn();
  render(
    <SongPreferencesForm
      songPreferences={{ hide_chords: false }}
      onChange={onChange}
    />
  );
  const checkbox = screen.getByLabelText('Show chords in songs');
  expect(checkbox).toBeChecked();
  fireEvent.click(checkbox);
  expect(onChange).toHaveBeenCalledWith('hide_chords', true);
  expect(checkbox).not.toBeChecked();
});
