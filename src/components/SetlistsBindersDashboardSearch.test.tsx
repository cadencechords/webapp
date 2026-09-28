import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { setSetlistBeingPresented } from '../store/presenterSlice';
import type { AxiosResponse } from 'axios';
import type { ComponentProps } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProvider } from '../utils/test';
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
import PublicSetlistSection from './PublicSetlistSection';
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

test('Dashboard lists today’s sets as rows opening each set, offering Perform only for sets with songs', () => {
  const { container } = renderWithProvider(
    <MemoryRouter>
      <Dashboard
        data={{
          todays_setlists: [
            { id: 1, name: 'Sunday AM', scheduled_songs: [{}, {}] },
            { id: 2, name: 'Sunday PM', scheduled_songs: [{}] },
            { id: 3, name: 'Rehearsal' },
          ],
        }}
      />
    </MemoryRouter>
  );
  const perform = screen.getAllByRole('link', { name: 'Perform' });
  expect(perform.map(link => link.getAttribute('href'))).toEqual([
    '/sets/1/present',
    '/sets/2/present',
  ]);
  expect(screen.getByRole('link', { name: 'Rehearsal' })).toHaveAttribute(
    'href',
    '/sets/3'
  );
  expect(screen.getByText('2 songs')).toBeInTheDocument();
  expect(screen.getByText('1 song')).toBeInTheDocument();
  expect(screen.getByText('0 songs')).toBeInTheDocument();
  expect(container.querySelector('.list-segmented')?.children).toHaveLength(3);
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
  expect(hymns).toHaveAttribute('href', '/folders/6');
  expect(hymns).toHaveTextContent(/1 song$/);
  // No songs loaded: the count is blank and the word plural.
  expect(screen.getByText('Loading').closest('a')).toHaveTextContent(
    /Loading songs$/
  );
});

test('SetlistsTabs maps the tab index to upcoming and past', () => {
  const onChange =
    vi.fn<NonNullable<ComponentProps<typeof SetlistsTabs>['onChange']>>();
  renderWithProvider(
    <SetlistsTabs selectedTab="upcoming" onChange={onChange} />
  );
  expect(screen.getByRole('tab', { name: 'Upcoming' })).toHaveAttribute(
    'aria-selected',
    'true'
  );
  expect(screen.getByRole('tab', { name: 'Upcoming' })).toHaveClass(
    'text-primary'
  );
  expect(screen.getByRole('tab', { name: 'Past' })).toHaveClass(
    'text-on-surface-variant'
  );
  fireEvent.click(screen.getByText('Past'));
  expect(onChange).toHaveBeenLastCalledWith('past');
});

type SetlistOptionsPopoverProps = ComponentProps<typeof SetlistOptionsPopover>;

test('SetlistOptionsPopover hides without songs or the delete permission, and offers Perform only with songs', () => {
  const setlist: Setlist = { id: 8, name: 'Set', songs: [] };
  const { container } = renderWithProvider(
    <MemoryRouter>
      <SetlistOptionsPopover
        setlist={setlist}
        onPerform={vi.fn<SetlistOptionsPopoverProps['onPerform']>()}
      />
    </MemoryRouter>,
    { preloadedState: state([]) }
  );
  expect(container).toBeEmptyDOMElement();

  // With the delete permission it shows, but with no Perform for no songs.
  const { container: canDelete, unmount } = renderWithProvider(
    <MemoryRouter>
      <SetlistOptionsPopover
        setlist={setlist}
        onPerform={vi.fn<SetlistOptionsPopoverProps['onPerform']>()}
      />
    </MemoryRouter>,
    { preloadedState: state([DELETE_SETLISTS]) }
  );
  fireEvent.click(within(canDelete).getAllByRole('button')[0]);
  expect(screen.getByText('Delete')).toBeInTheDocument();
  expect(screen.queryByText('Perform')).not.toBeInTheDocument();
  unmount();

  const onPerform = vi.fn<SetlistOptionsPopoverProps['onPerform']>();
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

type SetlistSongsListProps = ComponentProps<typeof SetlistSongsList>;

test('SetlistSongsList shows a message for no songs or unloaded songs', () => {
  const props = {
    onSongsAdded: vi.fn<SetlistSongsListProps['onSongsAdded']>(),
    onReordered: vi.fn<SetlistSongsListProps['onReordered']>(),
    onSongRemoved: vi.fn<SetlistSongsListProps['onSongRemoved']>(),
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
  // AddSongsDialog loads the team's songs as it mounts.
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
  expect(screen.getByRole('button', { name: 'Add songs' })).toBeInTheDocument();
  const search = screen.getByPlaceholderText('Search songs in folder');
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

type AddSongsToSetDialogProps = ComponentProps<typeof AddSongsToSetDialog>;

test('AddSongsToSetDialog lists the unbound songs and adds the picked ones to the routed set', async () => {
  vi.spyOn(SongApi, 'getAll').mockResolvedValue(
    response([song(1, 'Bound'), song(2, 'Free'), song(3, 'Other')])
  );
  const added = [song(2, 'Free')];
  const addSongs = vi
    .spyOn(SetlistApi, 'addSongs')
    .mockResolvedValue(response(added));
  const onAdded = vi.fn<AddSongsToSetDialogProps['onAdded']>();
  const onCloseDialog = vi.fn<AddSongsToSetDialogProps['onCloseDialog']>();
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
        <CreateSetlistDialog
          open
          onCloseDialog={vi.fn<
            ComponentProps<typeof CreateSetlistDialog>['onCloseDialog']
          >()}
        />
      </MemoryRouter>,
      { preloadedState: state(permissions, { isPro }) }
    );
    fireEvent.change(screen.getByLabelText('Name'), {
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
    // A row's headline is the first line of its text.
    screen
      .getAllByRole('link')
      .map(link => link.firstChild?.firstChild?.textContent);
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
  const { store } = renderWithProvider(
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
  // Filled M3E buttons: medium on phones, small from md up.
  const perform = screen.getAllByRole('button', { name: 'Perform' });
  expect(perform).toHaveLength(2);
  expect(perform[0]).toHaveClass('bg-primary', 'h-14', 'md:hidden');
  expect(perform[1]).toHaveClass('bg-primary', 'h-10', 'md:flex');

  // The public link, on the same card as the team's join link.
  const toggle = screen.getByRole('switch', { name: 'Public link' });
  expect(toggle).toHaveAttribute('aria-checked', 'false');
  expect(screen.getByRole('button', { name: 'Copy' })).toBeDisabled();
  fireEvent.click(toggle);
  await waitFor(() => expect(toggle).toHaveAttribute('aria-checked', 'true'));
  // Other store updates don't fetch the set again: the member it once
  // depended on was a new object on each one.
  act(() => {
    store.dispatch(setSetlistBeingPresented({}));
  });
  expect(SetlistApi.getOne).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: 'Copy' })).toBeEnabled();
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

test('PublicSetlistSection lets members without Publish sets copy the link, not turn it off', () => {
  const writeText = vi.fn<(text: string) => Promise<void>>();
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
  renderWithProvider(
    <PublicSetlistSection
      setlist={{
        id: 9,
        name: 'Sunday',
        public_link: 'xyz',
        public_link_enabled: true,
      }}
      onChange={() => {}}
    />,
    { preloadedState: state([]) }
  );
  expect(screen.getByText('Public link')).toBeInTheDocument();
  expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
  expect(writeText).toHaveBeenCalledWith(
    expect.stringMatching(/\/setlists\/xyz$/)
  );
  expect(screen.getByRole('button', { name: 'Copied' })).toBeDisabled();
});
