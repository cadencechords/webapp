import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import type { AxiosResponse } from 'axios';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProvider } from '../utils/test';
import BinderApi from '../api/BinderApi';
import SetlistApi from '../api/SetlistApi';
import SongApi from '../api/SongApi';
import {
  ADD_EVENTS,
  DELETE_SETLISTS,
  EDIT_BINDERS,
  PUBLISH_SETLISTS,
} from '../utils/constants';
import AddSongsToSetDialog from './AddSongsToSetDialog';
import BinderRow from './BinderRow';
import BinderSongsList from './BinderSongsList';
import CreateSetlistDialog from './CreateSetlistDialog';
import Dashboard from './Dashboard';
import SearchDialog from './SearchDialog';
import SetlistOptionsPopover from './SetlistOptionsPopover';
import SetlistRow from './SetlistRow';
import SetlistSongsList from './SetlistSongsList';
import SetlistsTabs from './SetlistsTabs';
import SetlistDetailPage from '../pages/SetlistDetailPage';
import SetlistsIndexPage from '../pages/SetlistsIndexPage';
import type { Binder, Setlist, Song } from '../types';

// Pins the behavior of the files converted in CAD-134.

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
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/**
 * `as`: the components read only `data`, so the rest of an `AxiosResponse`
 * is left out.
 */
const response = <T,>(data: T) => ({ data }) as AxiosResponse<T>;

function song(id: number, name: string): Song {
  return { id, name, format: {} };
}

function state(permissions: string[], { isPro = false } = {}) {
  return {
    auth: {
      currentUser: {
        id: 1,
        email: 'me@example.com',
        role: {
          id: 1,
          name: 'Admin',
          permissions: permissions.map(name => ({ name })),
        },
      },
    },
    subscription: { subscription: { isPro } },
  };
}

test('Dashboard lists today’s sets, offering Present only for sets with songs', () => {
  const { container } = renderWithProvider(
    <MemoryRouter>
      <Dashboard
        data={{
          todays_setlists: [
            { id: 1, name: 'Sunday AM', scheduled_songs: [{}, {}] },
            { id: 2, name: 'Sunday PM', scheduled_songs: [] },
            { id: 3, name: 'Rehearsal' },
          ],
        }}
      />
    </MemoryRouter>
  );
  expect(screen.getAllByText('Present')).toHaveLength(1);
  expect(screen.getByText('Present').closest('a')).toHaveAttribute(
    'href',
    '/sets/1/present'
  );
  expect(screen.getAllByText('Details')).toHaveLength(3);
  expect(container).not.toHaveTextContent('No sets are scheduled for today');
});

test('Dashboard says when no sets are scheduled, and renders nothing without data', () => {
  const { rerender, container } = renderWithProvider(
    <Dashboard data={{ todays_setlists: [] }} />
  );
  expect(
    screen.getByText('No sets are scheduled for today')
  ).toBeInTheDocument();
  rerender(<Dashboard data={undefined} />);
  expect(container).toBeEmptyDOMElement();
});

test('SetlistRow and BinderRow count songs, plural unless exactly one', () => {
  renderWithProvider(
    <MemoryRouter>
      <SetlistRow
        setlist={{
          id: 4,
          name: 'Easter',
          scheduled_date: '2030-04-21',
          songs: [song(1, 'A')],
        }}
      />
      <SetlistRow setlist={{ id: 5, name: 'Empty', songs: [] }} />
      <BinderRow binder={{ id: 6, name: 'Hymns', songs: [song(1, 'A')] }} />
      <BinderRow binder={{ id: 7, name: 'Loading' }} />
    </MemoryRouter>
  );
  const easter = screen.getByRole('link', { name: /Easter/ });
  expect(easter).toHaveAttribute('href', '/sets/4');
  expect(easter).toHaveTextContent('1 song·Sun Apr 21, 2030');
  expect(screen.getByText('Empty').closest('a')).toHaveTextContent('0 songs');
  const hymns = screen.getByRole('link', { name: /Hymns/ });
  expect(hymns).toHaveAttribute('href', '/binders/6');
  expect(hymns).toHaveTextContent(/1 song$/);
  // No songs loaded: the count is blank and the word plural.
  expect(screen.getByText('Loading').closest('a')).toHaveTextContent(
    /Loading songs$/
  );
});

test('SetlistsTabs maps the tab index to upcoming and past', () => {
  const onChange = vi.fn();
  renderWithProvider(
    <SetlistsTabs selectedTab="upcoming" onChange={onChange} />
  );
  expect(screen.getByText('Upcoming')).toHaveClass('bg-blue-600');
  expect(screen.getByText('Past')).not.toHaveClass('bg-blue-600');
  fireEvent.click(screen.getByText('Past'));
  expect(onChange).toHaveBeenLastCalledWith('past');
});

test('SetlistOptionsPopover hides without songs or the delete permission, and offers Perform only with songs', () => {
  const setlist: Setlist = { id: 8, name: 'Set', songs: [] };
  const { container } = renderWithProvider(
    <MemoryRouter>
      <SetlistOptionsPopover setlist={setlist} onPerform={vi.fn()} />
    </MemoryRouter>,
    { preloadedState: state([]) }
  );
  expect(container).toBeEmptyDOMElement();

  // With the delete permission it shows, but with no Perform for no songs.
  const { container: canDelete, unmount } = renderWithProvider(
    <MemoryRouter>
      <SetlistOptionsPopover setlist={setlist} onPerform={vi.fn()} />
    </MemoryRouter>,
    { preloadedState: state([DELETE_SETLISTS]) }
  );
  fireEvent.click(within(canDelete).getAllByRole('button')[0]);
  expect(screen.getByText('Delete')).toBeInTheDocument();
  expect(screen.queryByText('Perform')).not.toBeInTheDocument();
  unmount();

  const onPerform = vi.fn();
  const { container: withSongs } = renderWithProvider(
    <MemoryRouter>
      <SetlistOptionsPopover
        setlist={{ ...setlist, songs: [song(1, 'A')] }}
        onPerform={onPerform}
      />
    </MemoryRouter>,
    { preloadedState: state([]) }
  );
  fireEvent.click(within(withSongs).getAllByRole('button')[0]);
  fireEvent.click(screen.getByText('Perform'));
  expect(onPerform).toHaveBeenCalled();
  expect(screen.queryByText('Delete')).not.toBeInTheDocument();
});

test('SetlistSongsList shows a message for no songs or unloaded songs', () => {
  const props = {
    onSongsAdded: vi.fn(),
    onReordered: vi.fn(),
    onSongRemoved: vi.fn(),
  };
  const { rerender } = renderWithProvider(
    <MemoryRouter>
      <SetlistSongsList {...props} />
    </MemoryRouter>,
    { preloadedState: state([]) }
  );
  expect(screen.getByText('No songs to show')).toBeInTheDocument();
  rerender(
    <MemoryRouter>
      <SetlistSongsList {...props} songs={[song(1, 'Holy')]} />
    </MemoryRouter>
  );
  expect(screen.queryByText('No songs to show')).not.toBeInTheDocument();
  expect(screen.getByText('Holy')).toBeInTheDocument();
  rerender(
    <MemoryRouter>
      <SetlistSongsList {...props} songs={[]} />
    </MemoryRouter>
  );
  expect(screen.getByText('No songs to show')).toBeInTheDocument();
});

test('BinderSongsList filters by more than one letter and shows a still-empty binder', () => {
  // SearchSongsDialog loads the team's songs as it mounts.
  vi.spyOn(SongApi, 'getAll').mockResolvedValue(response([]));
  const binder: Binder = {
    id: 3,
    name: 'Hymns',
    songs: [song(1, 'Amazing Grace'), song(2, 'Be Thou My Vision')],
  };
  const { rerender } = renderWithProvider(
    <MemoryRouter>
      <BinderSongsList binder={binder} />
    </MemoryRouter>,
    { preloadedState: state([EDIT_BINDERS]) }
  );
  expect(screen.getByText('2 total')).toBeInTheDocument();
  expect(screen.getByText('Add Songs')).toBeInTheDocument();
  const search = screen.getByPlaceholderText('Search songs in binder');
  fireEvent.change(search, { target: { value: 'g' } });
  expect(screen.getByText('Be Thou My Vision')).toBeInTheDocument();
  fireEvent.change(search, { target: { value: 'GR' } });
  expect(screen.getByText('Amazing Grace')).toBeInTheDocument();
  expect(screen.queryByText('Be Thou My Vision')).not.toBeInTheDocument();

  rerender(
    <MemoryRouter>
      <BinderSongsList binder={{}} />
    </MemoryRouter>
  );
  fireEvent.change(search, { target: { value: '' } });
  expect(screen.getByText('No songs to show')).toBeInTheDocument();
});

test('AddSongsToSetDialog lists the unbound songs and adds the picked ones to the routed set', async () => {
  vi.spyOn(SongApi, 'getAll').mockResolvedValue(
    response([song(1, 'Bound'), song(2, 'Free'), song(3, 'Other')])
  );
  const added = [song(2, 'Free')];
  const addSongs = vi
    .spyOn(SetlistApi, 'addSongs')
    .mockResolvedValue(response(added));
  const onAdded = vi.fn();
  const onCloseDialog = vi.fn();
  renderWithProvider(
    <MemoryRouter initialEntries={['/sets/12']}>
      <Route path="/sets/:id">
        <AddSongsToSetDialog
          open
          onCloseDialog={onCloseDialog}
          onAdded={onAdded}
          boundSongs={[song(1, 'Bound')]}
        />
      </Route>
    </MemoryRouter>
  );
  await screen.findByText('Free');
  expect(screen.queryByText('Bound')).not.toBeInTheDocument();
  expect(screen.getByText('Add 0 songs').closest('button')).toBeDisabled();
  fireEvent.click(screen.getByText('Free'));
  fireEvent.click(screen.getByText('Add 1 song'));
  await waitFor(() => expect(onAdded).toHaveBeenCalledWith(added));
  expect(addSongs).toHaveBeenCalledWith('12', [2]);
  expect(onCloseDialog).toHaveBeenCalled();
});

test('CreateSetlistDialog asks to add a calendar event only for pro teams that can add events', async () => {
  const createOne = vi
    .spyOn(SetlistApi, 'createOne')
    .mockResolvedValue(response({ id: 20, name: 'New' }));

  async function create(permissions: string[], isPro: boolean) {
    const { unmount } = renderWithProvider(
      <MemoryRouter>
        <CreateSetlistDialog open onCloseDialog={vi.fn()} />
      </MemoryRouter>,
      { preloadedState: state(permissions, { isPro }) }
    );
    fireEvent.change(screen.getByPlaceholderText('Give your set a name'), {
      target: { value: 'New' },
    });
    fireEvent.change(
      // Non-null: OutlinedInput gives the date input this id.
      document.getElementById('date-picker')!,
      {
        target: { value: '2030-01-15' },
      }
    );
    fireEvent.click(screen.getByText('Create'));
    await waitFor(() => expect(createOne).toHaveBeenCalled());
    const [[newSetlist]] = createOne.mock.calls.slice(-1);
    createOne.mockClear();
    unmount();
    return newSetlist;
  }

  const withCalendar = await create([ADD_EVENTS], true);
  expect(withCalendar).toEqual({
    name: 'New',
    scheduledDate: new Date(2030, 0, 15),
    shouldAddToCalendar: true,
  });
  expect(await create([ADD_EVENTS], false)).not.toHaveProperty(
    'shouldAddToCalendar'
  );
  expect(await create([], true)).not.toHaveProperty('shouldAddToCalendar');
});

test('SearchDialog searches binders, songs and sets once typing pauses', async () => {
  const binderSearch = vi
    .spyOn(BinderApi, 'search')
    .mockResolvedValue(response([{ id: 1, name: 'Grace binder' }]));
  const songSearch = vi
    .spyOn(SongApi, 'search')
    .mockResolvedValue(response([song(2, 'Grace song')]));
  const setlistSearch = vi
    .spyOn(SetlistApi, 'search')
    .mockResolvedValue(response([{ id: 3, name: 'Grace set' }]));
  renderWithProvider(
    <MemoryRouter>
      <SearchDialog open onCloseDialog={vi.fn()} />
    </MemoryRouter>
  );
  const input = screen.getByPlaceholderText(
    'Search for binders, songs or sets'
  );
  fireEvent.change(input, { target: { value: 'gr' } });
  fireEvent.change(input, { target: { value: 'grace' } });
  // Each result's name is split around the highlighted query, so check the
  // links.
  await waitFor(() =>
    expect(
      screen.getAllByRole('link').map(link => link.getAttribute('href'))
    ).toEqual(['/binders/1', '/songs/2', '/sets/3'])
  );
  // Debounced: only the last query is searched.
  expect(binderSearch.mock.calls).toEqual([['grace']]);
  expect(songSearch.mock.calls).toEqual([['grace']]);
  expect(setlistSearch.mock.calls).toEqual([['grace']]);
});

test('SetlistsIndexPage splits sets into upcoming (soonest first) and past (latest first)', async () => {
  vi.spyOn(SetlistApi, 'getAll').mockResolvedValue(
    response<Setlist[]>([
      { id: 1, name: 'Old', scheduled_date: '2001-01-01', songs: [] },
      { id: 2, name: 'Later', scheduled_date: '2099-06-01', songs: [] },
      { id: 3, name: 'Older', scheduled_date: '2000-01-01', songs: [] },
      { id: 4, name: 'Sooner', scheduled_date: '2099-01-01', songs: [] },
    ])
  );
  renderWithProvider(
    <MemoryRouter>
      <SetlistsIndexPage />
    </MemoryRouter>,
    { preloadedState: state([]) }
  );
  expect(await screen.findByText('4 total')).toBeInTheDocument();
  const names = () =>
    screen.getAllByRole('link').map(link => link.firstChild?.textContent);
  expect(names()).toEqual(['Sooner', 'Later']);
  fireEvent.click(screen.getByText('Past'));
  expect(names()).toEqual(['Old', 'Older']);
  fireEvent.change(screen.getByPlaceholderText('Search your sets'), {
    target: { value: 'olde' },
  });
  expect(names()).toEqual(['Older']);
});

test('SetlistDetailPage offers Perform with songs and toggles the public link', async () => {
  vi.spyOn(SetlistApi, 'getOne').mockResolvedValue(
    response<Setlist>({
      id: 9,
      name: 'Sunday',
      scheduled_date: '2030-03-03',
      public_link_enabled: false,
      songs: [song(1, 'Holy')],
    })
  );
  const updateOne = vi
    .spyOn(SetlistApi, 'updateOne')
    .mockResolvedValue(response({ id: 9, name: 'Sunday' }));
  renderWithProvider(
    <MemoryRouter initialEntries={['/sets/9']}>
      <Route path="/sets/:id">
        <SetlistDetailPage />
      </Route>
    </MemoryRouter>,
    { preloadedState: state([PUBLISH_SETLISTS, DELETE_SETLISTS]) }
  );
  expect(await screen.findByText('Holy')).toBeInTheDocument();
  expect(document.title).toBe('Sunday | Sets');
  expect(screen.getByText('Sun Mar 3')).toBeInTheDocument();
  expect(screen.getAllByText('Perform')).toHaveLength(2);

  fireEvent.click(screen.getByText('Enable'));
  expect(await screen.findByText('Disable')).toBeInTheDocument();
  expect(updateOne).toHaveBeenCalledWith({ publicLinkEnabled: true }, 9);
});

test('SetlistDetailPage offers no Perform for a set without songs', async () => {
  vi.spyOn(SetlistApi, 'getOne').mockResolvedValue(
    response<Setlist>({ id: 10, name: 'Empty', songs: [] })
  );
  renderWithProvider(
    <MemoryRouter initialEntries={['/sets/10']}>
      <Route path="/sets/:id">
        <SetlistDetailPage />
      </Route>
    </MemoryRouter>,
    { preloadedState: state([DELETE_SETLISTS]) }
  );
  const songsHeading = await screen.findByText('No songs to show');
  expect(within(document.body).queryByText('Perform')).not.toBeInTheDocument();
  expect(songsHeading).toBeInTheDocument();
});
