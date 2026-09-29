import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useEffect, type ComponentProps } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import type { AxiosResponse } from 'axios';
import AddGenreDialog from './AddGenreDialog';
import BoldItalicButtonGroup from './BoldItalicButtonGroup';
import EditorFormatOptions from './EditorFormatOptions';
import EditorNavbar from './EditorNavbar';
import Editor from './Editor';
import FormatPanel, { type Coordinates } from './FormatPanel';
import FormatPanelChordOptions from './FormatPanelChordOptions';
import FormatPanelGeneralOptions from './FormatPanelGeneralOptions';
import FormatPreview from './FormatPreview';
import MeterDialog from './MeterDialog';
import PrintSongDialog from './PrintSongDialog';
import SongPreferencesForm from './SongPreferencesForm';
import TransposedKeyField from './TransposedKeyField';
import SongEditorProvider from '../contexts/SongEditorProvider';
import useSongEditor from '../hooks/useSongEditor';
import useSongForm from '../hooks/forms/useSongForm';
import { renderWithProvider } from '../utils/test';
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
  const onChange =
    vi.fn<
      NonNullable<ComponentProps<typeof BoldItalicButtonGroup>['onChange']>
    >();
  const { container } = render(
    <BoldItalicButtonGroup isBold isItalic={false} onChange={onChange} />
  );
  const [bold, italic] = container.querySelectorAll('button');
  expect(bold).toHaveClass('bg-primary');
  expect(italic).not.toHaveClass('bg-primary');

  fireEvent.click(bold);
  expect(onChange).toHaveBeenLastCalledWith('bold_chords', false);
  fireEvent.click(italic);
  expect(onChange).toHaveBeenLastCalledWith('italic_chords', true);
});

describe('EditorNavbar', () => {
  function renderNavbar(props: Partial<ComponentProps<typeof EditorNavbar>>) {
    const onSave = vi.fn<() => void>();
    const onToggleFormatOptions = vi.fn<() => void>();
    renderWithProvider(
      <MemoryRouter>
        <EditorNavbar
          name="Amazing Grace"
          dirty={false}
          saving={false}
          isFormatOpen={false}
          onSave={onSave}
          onToggleFormatOptions={onToggleFormatOptions}
          {...props}
        />
      </MemoryRouter>
    );
    return { onSave, onToggleFormatOptions };
  }

  test('is a top app bar with the song, the format toggle and Save', () => {
    const { onToggleFormatOptions } = renderNavbar({});
    expect(screen.getByRole('banner')).toHaveClass('sticky', 'bg-surface');
    expect(
      screen.getByRole('heading', { name: 'Amazing Grace' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.queryByText('Unsaved changes')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();

    const format = screen.getByRole('button', { name: 'Format options' });
    expect(format).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(format);
    expect(onToggleFormatOptions).toHaveBeenCalled();
  });

  test('says there are unsaved changes and saves them', () => {
    const { onSave } = renderNavbar({ dirty: true, isFormatOpen: true });
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Format options' })
    ).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSave).toHaveBeenCalled();
  });
});

test('Editor edits the content in a labelled textarea', () => {
  const onContentChange = vi.fn<(content: string) => void>();
  render(
    <Editor
      song={{ content: 'Amazing grace', format: {} }}
      onContentChange={onContentChange}
    />
  );
  const textarea = screen.getByRole('textbox', { name: 'Song content' });
  fireEvent.change(textarea, { target: { value: 'How sweet' } });
  expect(onContentChange).toHaveBeenCalledWith('How sweet');
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
    const value = useSongEditor();
    useEffect(() => {
      editor.current = value;
    });
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

test('the chord options label each color', () => {
  renderEditor(editorSong, <FormatPanelChordOptions />);
  expect(screen.getByText('Style')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Chord color' })).toBeInTheDocument();
  expect(
    screen.getByRole('img', { name: 'Highlight color' })
  ).toBeInTheDocument();
});

test('the general options pick a font from a menu and step the size', () => {
  const editor = renderEditor(
    { ...editorSong, format: { font: 'Open Sans', font_size: 16 } },
    <FormatPanelGeneralOptions />
  );
  fireEvent.click(screen.getByRole('button', { name: 'Open Sans' }));
  fireEvent.click(screen.getByRole('button', { name: 'Roboto Mono' }));
  expect(editor.current?.song?.format?.font).toBe('Roboto Mono');

  expect(screen.getByText('16')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Larger' }));
  expect(editor.current?.song?.format?.font_size).toBe('17');
  fireEvent.click(screen.getByRole('button', { name: 'Smaller' }));
  fireEvent.click(screen.getByRole('button', { name: 'Smaller' }));
  expect(editor.current?.song?.format?.font_size).toBe('15');
});

test('the size stepper stops at the smallest size', () => {
  renderEditor(
    { ...editorSong, format: { font_size: 10 } },
    <FormatPanelGeneralOptions />
  );
  expect(screen.getByRole('button', { name: 'Smaller' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Larger' })).toBeEnabled();
});

test('FormatPanel is a floating M3 panel with tabs and a close button', () => {
  const onClose = vi.fn<() => void>();
  renderEditor(
    editorSong,
    <FormatPanel
      onClose={onClose}
      defaultCoordinates={{ x: 0, y: 0 }}
      onCoordinatesChange={() => {}}
    />
  );
  const panel = screen.getByRole('region', { name: 'Format' });
  expect(panel).toHaveClass('rounded-extra-large', 'bg-surface-container-high');
  expect(screen.getByText('Font')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Chords'));
  expect(screen.getByText('Chord color')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(onClose).toHaveBeenCalled();
});

test('FormatPanel stays inside the window as it resizes', () => {
  // jsdom lays nothing out: give the panel a size and the window one.
  const width = vi
    .spyOn(HTMLElement.prototype, 'offsetWidth', 'get')
    .mockReturnValue(320);
  const height = vi
    .spyOn(HTMLElement.prototype, 'offsetHeight', 'get')
    .mockReturnValue(300);
  const { innerWidth, innerHeight } = window;
  const resizeTo = (w: number, h: number) => {
    Object.defineProperty(window, 'innerWidth', {
      value: w,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: h,
      configurable: true,
    });
    fireEvent(window, new Event('resize'));
  };
  resizeTo(800, 600);

  const onCoordinatesChange = vi.fn<(coordinates: Coordinates) => void>();
  renderEditor(
    editorSong,
    <FormatPanel
      onClose={() => {}}
      defaultCoordinates={{ x: 600, y: 500 }}
      onCoordinatesChange={onCoordinatesChange}
    />
  );
  const panel = screen.getByRole('region', { name: 'Format' });
  expect(panel).toHaveClass('fixed');
  // Placed past the window's edge, it starts at the edge: 800 - 320, 600 - 300.
  expect(panel.style.transform).toBe('translate(480px,300px)');
  expect(onCoordinatesChange).toHaveBeenLastCalledWith({ x: 480, y: 300 });

  act(() => resizeTo(500, 400));
  expect(panel.style.transform).toBe('translate(180px,100px)');
  expect(onCoordinatesChange).toHaveBeenLastCalledWith({ x: 180, y: 100 });

  // Growing the window again leaves it where it is.
  act(() => resizeTo(1200, 900));
  expect(panel.style.transform).toBe('translate(180px,100px)');

  width.mockRestore();
  height.mockRestore();
  resizeTo(innerWidth, innerHeight);
});

test('useSongForm is valid once named, and clears', () => {
  const form: { current?: ReturnType<typeof useSongForm> } = {};
  function Probe() {
    const value = useSongForm();
    useEffect(() => {
      form.current = value;
    });
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
  const onMeterChange =
    vi.fn<ComponentProps<typeof MeterDialog>['onMeterChange']>();
  const onCloseDialog =
    vi.fn<ComponentProps<typeof MeterDialog>['onCloseDialog']>();
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
  const onMeterChange =
    vi.fn<ComponentProps<typeof MeterDialog>['onMeterChange']>();
  render(
    <MeterDialog open onMeterChange={onMeterChange} onCloseDialog={() => {}} />
  );
  fireEvent.click(screen.getByText('Confirm'));
  expect(onMeterChange).toHaveBeenCalledWith('4/4');
});

test('MeterDialog reads two-digit beat units and marks the common meter picked', () => {
  const onMeterChange =
    vi.fn<ComponentProps<typeof MeterDialog>['onMeterChange']>();
  render(
    <MeterDialog
      open
      meter="6/16"
      onMeterChange={onMeterChange}
      onCloseDialog={() => {}}
    />
  );
  const [, denominator] = screen.getAllByRole('spinbutton');
  expect(denominator).toHaveValue(16);

  fireEvent.click(screen.getByRole('button', { name: '3/4' }));
  expect(screen.getByRole('button', { name: '3/4' })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  fireEvent.click(screen.getByText('Confirm'));
  expect(onMeterChange).toHaveBeenCalledWith('3/4');
});

test('TransposedKeyField steps from the transposed key, else the original', () => {
  const onChange =
    vi.fn<ComponentProps<typeof TransposedKeyField>['onChange']>();
  const { rerender } = render(
    <TransposedKeyField
      originalKey="G"
      transposedKey="A"
      onChange={onChange}
      editable
    />
  );
  const up = () =>
    screen.getByRole('button', { name: 'Transpose up a half step' });
  const down = () =>
    screen.getByRole('button', { name: 'Transpose down a half step' });
  fireEvent.click(up());
  expect(onChange).toHaveBeenLastCalledWith('Bb');
  fireEvent.click(down());
  expect(onChange).toHaveBeenLastCalledWith('Ab');

  rerender(<TransposedKeyField originalKey="G" onChange={onChange} editable />);
  fireEvent.click(up());
  expect(onChange).toHaveBeenLastCalledWith('Ab');

  rerender(<TransposedKeyField onChange={onChange} editable />);
  expect(up()).toBeDisabled();
  expect(down()).toBeDisabled();

  // Read-only, there's nothing to step.
  rerender(<TransposedKeyField originalKey="G" onChange={onChange} />);
  expect(screen.queryByRole('button')).toBeNull();
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
  const onGenresAdded =
    vi.fn<ComponentProps<typeof AddGenreDialog>['onGenresAdded']>();
  const onCloseDialog =
    vi.fn<ComponentProps<typeof AddGenreDialog>['onCloseDialog']>();
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
  const onChange = vi.fn<ComponentProps<typeof FormatPreview>['onChange']>();
  const { rerender } = render(
    <FormatPreview format={preset} selected={false} onChange={onChange} />
  );
  fireEvent.click(screen.getByRole('button'));
  expect(onChange).toHaveBeenLastCalledWith(preset);

  rerender(<FormatPreview format={preset} selected onChange={onChange} />);
  fireEvent.click(screen.getByRole('button'));
  expect(onChange).toHaveBeenLastCalledWith(null);
});

test('SongPreferencesForm reports hiding chords when switched off', () => {
  const onChange =
    vi.fn<ComponentProps<typeof SongPreferencesForm>['onChange']>();
  render(
    <SongPreferencesForm
      songPreferences={{ hide_chords: false }}
      onChange={onChange}
    />
  );
  const toggle = screen.getByRole('switch', { name: /Show chords/ });
  expect(toggle).toBeChecked();
  // The whole row is the switch's label: clicking its text toggles it.
  fireEvent.click(screen.getByText('Show chords'));
  expect(onChange).toHaveBeenCalledWith('hide_chords', true);
  expect(toggle).not.toBeChecked();
  expect(toggle.closest('.list-segmented')).not.toBeNull();
});
