import { act, fireEvent, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProvider } from '../utils/test';
import {
  setSetlistBeingPresented,
  setSongBeingPresented,
  type PresentedSong,
} from '../store/presenterSlice';
import type { SessionsContextValue } from '../contexts/SessionsProvider';
import SetPresenterPage from './SetPresenterPage';
import type { Setlist, Song } from '../types';

// Pins how the presenter seeds its songs from the stored set (CAD-147).

vi.mock('../contexts/SessionsProvider', () => ({
  default: ({ children }: { children?: ReactNode }) => <>{children}</>,
  useSessionsContext: () => ({
    initializeHostSessionIfExists:
      vi.fn<SessionsContextValue['initializeHostSessionIfExists']>(),
    onSongChange: vi.fn<SessionsContextValue['onSongChange']>(),
    setSessions: vi.fn<SessionsContextValue['setSessions']>(),
    activeSessionDetails: {},
    onTryToJoinAsMember: vi.fn<SessionsContextValue['onTryToJoinAsMember']>(),
  }),
}));
vi.mock('../hooks/api/currentUser.hooks', () => ({
  useCurrentUser: () => ({ data: { id: 1 } }),
}));
vi.mock('../hooks/usePerformanceMode', () => ({
  default: () => ({ isPerforming: false, isAnnotating: false }),
}));
// Lists the presented songs, and edits the first like the presenter's
// controls do.
vi.mock('../components/SongsCarousel', () => ({
  default: ({
    songs,
    onSongUpdate,
  }: {
    songs: PresentedSong[];
    onSongUpdate: (field: 'name', value: string) => void;
  }) => (
    <>
      <ul>
        {songs.map(song => (
          <li key={song.id}>
            {`${song.name}: transposed ${song.show_transposed}, capo ${song.show_capo}`}
          </li>
        ))}
      </ul>
      <button onClick={() => onSongUpdate('name', 'Edited')}>Edit</button>
    </>
  ),
}));
vi.mock('../components/SetPresenterTopBar', () => ({ default: () => null }));
vi.mock('../components/SetPresenterBottomSheet', () => ({
  default: () => null,
}));
vi.mock('../components/SetlistAdjustmentsDrawer', () => ({
  default: () => null,
}));
vi.mock('../components/AddMarkingsModal', () => ({ default: () => null }));

const song = (id: number, name: string, fields: Partial<Song> = {}) =>
  ({ id, name, ...fields }) as Song;

const sunday = {
  id: 5,
  name: 'Sunday',
  songs: [
    song(1, 'Amazing Grace', { transposed_key: 'D' }),
    song(2, 'Holy', { capo: { id: 1, capo_key: 'G' } }),
  ],
} as Setlist;

function renderPresenter() {
  return renderWithProvider(
    <MemoryRouter initialEntries={['/sets/5/present']}>
      <Route path="/sets/:id/present">
        <SetPresenterPage />
      </Route>
    </MemoryRouter>,
    {
      preloadedState: {
        presenter: { setlistBeingPresented: sunday, songBeingPresented: {} },
        subscription: { subscription: { isPro: false } },
      },
    }
  );
}

test('presents the stored set’s songs from the first render', () => {
  renderPresenter();
  expect(
    screen.getByText('Amazing Grace: transposed true, capo false')
  ).toBeInTheDocument();
  expect(
    screen.getByText('Holy: transposed false, capo true')
  ).toBeInTheDocument();
});

test('keeps edits until another set is stored, then starts over from it', () => {
  const { store } = renderPresenter();
  fireEvent.click(screen.getByText('Edit'));
  expect(screen.getByText(/^Edited:/)).toBeInTheDocument();

  // Other presenter state changing leaves the set, and the edits, alone.
  act(() => {
    store.dispatch(setSongBeingPresented(song(9, 'Other')));
  });
  expect(screen.getByText(/^Edited:/)).toBeInTheDocument();

  act(() => {
    store.dispatch(
      setSetlistBeingPresented({ ...sunday, songs: [song(3, 'Psalm 23')] })
    );
  });
  expect(
    screen.getByText('Psalm 23: transposed false, capo false')
  ).toBeInTheDocument();
  expect(screen.queryByText(/^Edited:/)).not.toBeInTheDocument();
});
