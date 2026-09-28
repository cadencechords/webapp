import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import type { ComponentProps, ReactElement } from 'react';
import { renderWithProvider } from '../utils/test';
import TracksApi, {
  type AppleMusicSong,
  type YouTubeVideo,
} from '../api/tracksApi';
import FilesApi from '../api/filesApi';
import SongApi from '../api/SongApi';
import UserApi from '../api/UserApi';
import AppleMusicTrackResult from './AppleMusicTrackResult';
import YouTubeTrackResult from './YouTubeTrackResult';
import AddTracksDialog from '../dialogs/AddTracksDialog';
import FilesInput from './FilesInput';
import KeyChooserDialog from './KeyChooserDialog';
import KeyTransposerDialog from './KeyTransposerDialog';
import KeyOptionsPopover from './KeyOptionsPopover';
import KeyOptionsSheet from './KeyOptionsSheet';
import TransposeKeySheet from './TransposeKeySheet';
import SongFilesTab from './SongFilesTab';
import SongDetailPage from '../pages/SongDetailPage';
import SongsIndexPage from '../pages/SongsIndexPage';
import type { Song, SongFile, User } from '../types';

// Pins the behavior of the song detail, keys, files and tracks components
// converted in CAD-131.

vi.mock('../api/tracksApi');
vi.mock('../api/filesApi');
vi.mock('../api/SongApi');
vi.mock('../api/UserApi');
vi.mock('../utils/error');
// It loads PDF fonts from disk, which a jsdom test can't reach.
vi.mock('./PrintSongDialog', () => ({ default: () => null }));

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
});

function member(permissions: string[]) {
  return {
    auth: {
      currentUser: {
        id: 1,
        email: 'me@example.com',
        role: {
          id: 1,
          name: 'Member',
          permissions: permissions.map(name => ({ name })),
        },
      },
    },
    subscription: { subscription: { isPro: false } },
  };
}

function atSong(page: ReactElement, path = '/songs/:id') {
  return (
    <MemoryRouter initialEntries={['/songs/5']}>
      <Route path={path}>{page}</Route>
    </MemoryRouter>
  );
}

test('AppleMusicTrackResult sizes the artwork and reports the picked track', () => {
  const onClick =
    vi.fn<ComponentProps<typeof AppleMusicTrackResult>['onClick']>();
  const track: AppleMusicSong = {
    id: 'am1',
    attributes: {
      name: 'Holy',
      artistName: 'Band',
      url: 'https://music.apple.com/holy',
      artwork: { url: 'https://art/{w}x{h}.jpg' },
    },
  };
  render(
    <AppleMusicTrackResult track={track} selected={false} onClick={onClick} />
  );

  expect(screen.getByAltText('Holy Album Artwork')).toHaveAttribute(
    'src',
    'https://art/100x100.jpg'
  );
  fireEvent.click(screen.getByText('Holy'));
  expect(onClick).toHaveBeenCalledWith(
    {
      source: 'Apple Music',
      external_id: 'am1',
      url: 'https://music.apple.com/holy',
      artwork_url: 'https://art/400x400.jpg',
      name: 'Holy',
    },
    true
  );
});

test('YouTubeTrackResult reports a watch link and falls back to the default thumbnail', () => {
  const onClick = vi.fn<ComponentProps<typeof YouTubeTrackResult>['onClick']>();
  const track: YouTubeVideo = {
    id: { videoId: 'v1' },
    snippet: {
      title: 'Live',
      channelTitle: 'Channel',
      thumbnails: { default: { url: 'https://thumb/default.jpg' } },
    },
  };
  render(<YouTubeTrackResult track={track} selected onClick={onClick} />);

  fireEvent.click(screen.getByText('Live'));
  expect(onClick).toHaveBeenCalledWith(
    {
      source: 'YouTube',
      external_id: 'v1',
      url: 'https://www.youtube.com/watch/v1',
      artwork_url: 'https://thumb/default.jpg',
      name: 'Live',
    },
    false
  );
});

test('AddTracksDialog searches Spotify, collects the picked tracks and saves them', async () => {
  vi.mocked(TracksApi.searchSpotify).mockResolvedValue({
    data: {
      tracks: {
        items: [
          {
            id: 's1',
            name: 'Holy',
            artists: [{ name: 'A' }, { name: 'B' }],
            album: { images: [{ url: 'https://art/s1.jpg' }] },
            external_urls: { spotify: 'https://open.spotify.com/s1' },
          },
        ],
      },
    },
  } as Awaited<ReturnType<typeof TracksApi.searchSpotify>>);
  const saved = [{ id: 9, name: 'Holy' }];
  vi.mocked(TracksApi.createBulk).mockResolvedValue({
    data: saved,
  } as Awaited<ReturnType<typeof TracksApi.createBulk>>);
  const onTracksAdded =
    vi.fn<ComponentProps<typeof AddTracksDialog>['onTracksAdded']>();
  const onCloseDialog =
    vi.fn<ComponentProps<typeof AddTracksDialog>['onCloseDialog']>();
  const song = { id: 5, name: 'Holy', format: {} } as Song;

  render(
    <AddTracksDialog
      open
      onCloseDialog={onCloseDialog}
      song={song}
      onTracksAdded={onTracksAdded}
    />
  );

  expect(
    await screen.findByText('A, B', {}, { timeout: 2000 })
  ).toBeInTheDocument();
  expect(TracksApi.searchSpotify).toHaveBeenCalledWith('Holy');
  expect(screen.getByRole('button', { name: 'Add 0 tracks' })).toBeDisabled();

  fireEvent.click(screen.getByText('Holy', { selector: 'div' }));
  expect(screen.getByRole('checkbox')).toBeChecked();
  fireEvent.click(screen.getByRole('button', { name: 'Add 1 track' }));

  expect(TracksApi.createBulk).toHaveBeenCalledWith(
    [
      {
        source: 'Spotify',
        external_id: 's1',
        url: 'https://open.spotify.com/s1',
        artwork_url: 'https://art/s1.jpg',
        name: 'Holy',
      },
    ],
    5
  );
  await vi.waitFor(() => expect(onTracksAdded).toHaveBeenCalledWith(saved));
  expect(onCloseDialog).toHaveBeenCalled();
});

test('FilesInput reports chosen and removed files, and clears the input when empty', () => {
  const onChange = vi.fn<ComponentProps<typeof FilesInput>['onChange']>();
  const onRemove = vi.fn<ComponentProps<typeof FilesInput>['onRemove']>();
  const { container } = render(
    <FilesInput onChange={onChange} onRemove={onRemove} buttonText="Choose" />
  );
  const input = container.querySelector('input') as HTMLInputElement;
  const file = new File(['x'], 'song.pdf');

  fireEvent.change(input, { target: { files: [file] } });
  expect(onChange).toHaveBeenCalledWith([file]);
  expect(screen.getByText('song.pdf')).toBeInTheDocument();
  expect(screen.queryByText('Choose')).not.toBeInTheDocument();

  // jsdom leaves a file input's value empty, so give it one to clear.
  Object.defineProperty(input, 'value', { value: 'song.pdf', writable: true });
  fireEvent.click(screen.getByRole('button'));
  expect(onRemove).toHaveBeenCalledWith(file);
  expect(screen.getByText('Choose')).toBeInTheDocument();
  expect(input.value).toBe('');
});

test('KeyChooserDialog builds the key from the note and the quality', () => {
  const onChange = vi.fn<ComponentProps<typeof KeyChooserDialog>['onChange']>();
  render(
    <KeyChooserDialog
      open
      onCloseDialog={() => {}}
      currentSongKey="Am"
      onChange={onChange}
    />
  );

  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Am');
  fireEvent.click(screen.getByRole('button', { name: 'C' }));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Cm');
  fireEvent.click(screen.getByRole('button', { name: 'Major' }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
  expect(onChange).toHaveBeenCalledWith('C');
});

test('KeyTransposerDialog counts the semitones and can remove the transposition', () => {
  const onChange =
    vi.fn<ComponentProps<typeof KeyTransposerDialog>['onChange']>();
  render(
    <KeyTransposerDialog
      open
      onCloseDialog={() => {}}
      originalKey="C"
      transposedKey="D"
      onChange={onChange}
    />
  );

  expect(screen.getByText('+2')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Bb' }));
  expect(screen.getByText('-2')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Bb' })).toHaveAttribute(
    'aria-pressed',
    'true'
  );

  fireEvent.click(screen.getByRole('button', { name: 'Remove transposition' }));
  expect(screen.queryByText('Transposed')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
  expect(onChange).toHaveBeenCalledWith(null);
});

test('KeyOptionsPopover shows the capo key and its fret', () => {
  const song = {
    id: 1,
    name: 'Song',
    format: {},
    original_key: 'A',
    capo: { id: 2, capo_key: 'G' },
    show_capo: true,
  } as Song;
  render(<KeyOptionsPopover song={song} onUpdateSong={() => {}} />);

  const button = screen.getByRole('button', { name: 'Key G, capo 2' });
  expect(button).toHaveTextContent(/^GCapo 2$/);
  expect(button).toHaveClass('bg-primary', 'h-10');
});

test('KeyOptionsPopover stays open to show the chosen sheet', async () => {
  const song = {
    id: 1,
    name: 'Song',
    format: {},
    original_key: 'G',
    transposed_key: 'A',
  } as Song;
  renderWithProvider(<KeyOptionsPopover song={song} onUpdateSong={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Key G' }));
  const [transpose] =
    document.querySelectorAll<HTMLElement>('[data-menu-item]');
  fireEvent.click(transpose);
  // Still open, on the transpose sheet, not closed by choosing the item.
  await waitFor(() => expect(transpose.closest('.hidden')).not.toBeNull());
  expect(transpose).toBeInTheDocument();
  // The transpose sheet's title is the one "Transpose" still showing.
  expect(
    screen.getAllByText('Transpose').filter(title => !title.closest('.hidden'))
  ).toHaveLength(1);
});

test('TransposeKeySheet steps the key a half step, passing an unset key through', () => {
  const onUpdateSong =
    vi.fn<ComponentProps<typeof TransposeKeySheet>['onUpdateSong']>();
  const song = { id: 1, name: 'Song', format: {}, original_key: 'G' } as Song;
  const { rerender } = renderWithProvider(
    <TransposeKeySheet
      onChangeSheet={() => {}}
      song={song}
      onUpdateSong={onUpdateSong}
    />
  );

  const [, up, down] = screen.getAllByRole('button').slice(-3);
  fireEvent.click(up);
  expect(onUpdateSong).toHaveBeenLastCalledWith({ transposed_key: 'Ab' });
  fireEvent.click(down);
  expect(onUpdateSong).toHaveBeenLastCalledWith({ transposed_key: 'Gb' });
  expect(
    screen.getByRole('button', { name: 'Save changes' })
  ).toBeInTheDocument();

  rerender(
    <TransposeKeySheet
      onChangeSheet={() => {}}
      song={{ id: 1, name: 'Song', format: {} } as Song}
      onUpdateSong={onUpdateSong}
    />
  );
  fireEvent.click(up);
  expect(onUpdateSong).toHaveBeenLastCalledWith({ transposed_key: undefined });
});

test('SongFilesTab loads the files, then removes a deleted one', async () => {
  const files: SongFile[] = [
    { id: 1, name: 'a.pdf', url: 'https://f/a.pdf', size: 2048 },
    { id: 2, name: 'b.pdf', url: 'https://f/b.pdf', size: 1024 },
  ];
  vi.mocked(FilesApi.getFilesForSong).mockResolvedValue({
    data: files,
  } as Awaited<ReturnType<typeof FilesApi.getFilesForSong>>);
  const onFilesChange =
    vi.fn<ComponentProps<typeof SongFilesTab>['onFilesChange']>();

  const { rerender } = renderWithProvider(
    atSong(<SongFilesTab onFilesChange={onFilesChange} />),
    { preloadedState: member(['Delete files']) }
  );
  await vi.waitFor(() => expect(onFilesChange).toHaveBeenCalledWith(files));
  expect(FilesApi.getFilesForSong).toHaveBeenCalledWith('5');
  expect(screen.queryByText('Add file')).not.toBeInTheDocument();

  rerender(
    atSong(<SongFilesTab onFilesChange={onFilesChange} files={files} />)
  );
  expect(screen.getByText('a.pdf')).toBeInTheDocument();
  expect(screen.getByText('2 KB')).toBeInTheDocument();

  const first = screen
    .getByText('a.pdf')
    .closest('.flex-between') as HTMLElement;
  fireEvent.click(within(first).getAllByRole('button')[0]);
  expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  fireEvent.click(await screen.findByText('Delete'));
  expect(onFilesChange).toHaveBeenLastCalledWith([files[1]]);
  expect(FilesApi.deleteSongFile).toHaveBeenCalledWith('5', 1);
});

const detailSong = {
  id: 5,
  name: 'Holy',
  format: {},
  original_key: 'A',
  capo: { id: 2, capo_key: 'G' },
  genres: [],
  themes: [],
  tracks: [],
  binders: [],
  setlists: [],
} as Song;

test('SongDetailPage shows the key options and saves an edited name', async () => {
  vi.mocked(SongApi.getOneById).mockResolvedValue({
    data: structuredClone(detailSong),
  } as Awaited<ReturnType<typeof SongApi.getOneById>>);
  vi.mocked(UserApi.getCurrentUser).mockResolvedValue({
    data: { id: 1, email: 'me@example.com', format_preferences: {} } as User,
  } as Awaited<ReturnType<typeof UserApi.getCurrentUser>>);
  vi.mocked(SongApi.updateOneById).mockResolvedValue({
    data: { ...detailSong, name: 'Holy Holy' },
  } as Awaited<ReturnType<typeof SongApi.updateOneById>>);

  renderWithProvider(atSong(<SongDetailPage />), {
    preloadedState: member(['Edit songs']),
  });

  const title = await screen.findByDisplayValue('Holy');
  expect(document.title).toBe('Holy');
  expect(SongApi.getOneById).toHaveBeenCalledWith('5');
  // Edit (desktop and mobile) is a link styled as a button, not a button
  // inside a link.
  const editLinks = screen.getAllByRole('link', { name: 'Edit' });
  expect(editLinks).toHaveLength(2);
  for (const link of editLinks) {
    expect(link).toHaveAttribute('href', '/songs/5/edit');
    expect(link).toHaveClass('bg-surface-container-highest', 'shape-morph');
    expect(link.querySelector('button')).toBeNull();
  }
  const keyMenu = screen.getByRole('button', { name: /Key/ });
  expect(keyMenu).toHaveTextContent('Capo 2 (G)');
  fireEvent.click(keyMenu);
  const items = document.querySelectorAll('[data-menu-item]');
  expect([...items].map(item => item.textContent)).toEqual([
    'Original (A)',
    'Capo 2 (G)',
    'Hide chords',
  ]);
  expect(items[1]).toHaveClass('bg-tertiary-container');
  fireEvent.click(items[0]);
  expect(keyMenu).toHaveTextContent('Original (A)');

  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  fireEvent.change(title, { target: { value: 'Holy Holy' } });
  expect(screen.getByDisplayValue('Holy Holy')).toBeInTheDocument();
  // The unsaved changes bar sits above the title.
  const bar = screen.getByRole('status');
  expect(bar).toHaveTextContent('You have unsaved changes');
  expect(
    bar.compareDocumentPosition(screen.getByDisplayValue('Holy Holy'))
  ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  });
  expect(SongApi.updateOneById).toHaveBeenCalledWith('5', {
    name: 'Holy Holy',
  });
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

test('SongDetailPage records only the saved name as recently viewed', async () => {
  vi.mocked(SongApi.getOneById).mockResolvedValue({
    data: structuredClone(detailSong),
  } as Awaited<ReturnType<typeof SongApi.getOneById>>);
  vi.mocked(UserApi.getCurrentUser).mockResolvedValue({
    data: { id: 1, email: 'me@example.com', format_preferences: {} } as User,
  } as Awaited<ReturnType<typeof UserApi.getCurrentUser>>);
  localStorage.clear();

  const state = member(['Edit songs']);
  renderWithProvider(atSong(<SongDetailPage />), {
    preloadedState: { ...state, auth: { ...state.auth, teamId: 7 } },
  });
  const title = await screen.findByDisplayValue('Holy');
  fireEvent.change(title, { target: { value: 'Holy Holy' } });

  // An unsaved rename leaves the recorded name as it was.
  const stored = localStorage.getItem('recentlyViewed:7');
  expect(stored).toContain('"Holy"');
  expect(stored).not.toContain('Holy Holy');
});

test('SongsIndexPage filters the songs once the query is three letters', async () => {
  vi.mocked(SongApi.getAll).mockResolvedValue({
    data: [
      { id: 1, name: 'Amazing Grace', format: {}, original_key: 'G' },
      {
        id: 2,
        name: 'Holy',
        format: {},
        transposed_key: 'A',
        original_key: 'G',
      },
    ],
  } as Awaited<ReturnType<typeof SongApi.getAll>>);

  renderWithProvider(
    <MemoryRouter>
      <SongsIndexPage />
    </MemoryRouter>,
    { preloadedState: member([]) }
  );

  expect(await screen.findByText('2 total')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Holy A' })).toHaveAttribute(
    'href',
    '/songs/2'
  );
  const search = screen.getByPlaceholderText('Search your songs');
  fireEvent.change(search, { target: { value: 'gr' } });
  expect(screen.getAllByRole('link')).toHaveLength(2);
  fireEvent.change(search, { target: { value: 'GRA' } });
  expect(screen.getAllByRole('link').map(link => link.textContent)).toEqual([
    'Amazing Grace G',
  ]);
});

test('KeyOptionsSheet selects the key shown, like the song page’s key menu', () => {
  const song = {
    id: 1,
    name: 'Song',
    format: {},
    original_key: 'G',
    transposed_key: 'A',
    show_transposed: true,
    capo: { id: 2, capo_key: 'G' },
  } as Song;
  const { rerender } = render(
    <KeyOptionsSheet song={song} onChangeSheet={() => {}} />
  );
  const [transpose, capo] = document.querySelectorAll('[data-menu-item]');
  expect(transpose).toHaveClass('bg-tertiary-container');
  expect(transpose.querySelectorAll('svg')).toHaveLength(1);
  expect(capo).not.toHaveClass('bg-tertiary-container');
  expect(capo.querySelector('svg')).toBeNull();

  rerender(
    <KeyOptionsSheet
      song={{ ...song, show_transposed: false, show_capo: true }}
      onChangeSheet={() => {}}
    />
  );
  expect(transpose).not.toHaveClass('bg-tertiary-container');
  expect(capo).toHaveClass('bg-tertiary-container');
  expect(capo.querySelectorAll('svg')).toHaveLength(1);
});
