import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import presenterReducer, {
  adjustSongBeingPresented,
  selectSetlistBeingPresented,
  selectSongBeingPresented,
  setSetlistBeingPresented,
  setSongBeingPresented,
} from '../store/presenterSlice';
import { setupStore } from '../store/store';
import { findSessionCurrentUserIsHosting } from '../utils/sessions';
import Metronome from './Metronome';
import SetlistNavigation from './SetlistNavigation';
import SetlistAdjustmentsDrawer from './SetlistAdjustmentsDrawer';
import {
  SessionsContext,
  type SessionsContextValue,
} from '../contexts/SessionsProvider';
import { renderWithProvider } from '../utils/test';
import type { Session, Setlist, Song, User } from '../types';

// The metronome tool loads a click over XMLHttpRequest and plays through Web
// Audio; the component tests only need its tempo.
vi.mock('../tools/metronome', () => ({
  default: class {
    tempo: number | undefined;
    start = vi.fn();
    stop = vi.fn();
    constructor(tempo = 120) {
      this.tempo = tempo;
    }
  },
}));

const song: Song = { id: 1, name: 'Amazing Grace', format: {} };

describe('presenterSlice', () => {
  test('starts empty, then stores, adjusts and selects the song', () => {
    const store = setupStore();
    expect(selectSongBeingPresented(store.getState())).toEqual({});
    store.dispatch(setSongBeingPresented(song));
    store.dispatch(adjustSongBeingPresented({ bpm: 90 }));
    const selected = selectSongBeingPresented(store.getState());
    expect(selected).toEqual({ ...song, bpm: 90 });
    // A copy, not the stored object.
    expect(selected).not.toBe(store.getState().presenter.songBeingPresented);
  });

  test('stores and clears the setlist', () => {
    const setlist: Setlist = { id: 2, name: 'Sunday' };
    let state = presenterReducer(undefined, setSetlistBeingPresented(setlist));
    expect(
      selectSetlistBeingPresented({
        ...setupStore().getState(),
        presenter: state,
      })
    ).toBe(setlist);
    state = presenterReducer(state, setSetlistBeingPresented({}));
    expect(state.setlistBeingPresented).toEqual({});
  });
});

test('findSessionCurrentUserIsHosting finds the user’s session', () => {
  const user: User = { id: 7, email: 'a@b.c' };
  const hosted: Session = { id: 3, setlist_id: 2, user_id: 7, user };
  const other: Session = { id: 4, setlist_id: 2, user_id: 8, user };
  expect(findSessionCurrentUserIsHosting(user, [other, hosted])).toBe(hosted);
  expect(findSessionCurrentUserIsHosting(user, [other])).toBeUndefined();
  expect(findSessionCurrentUserIsHosting(user, undefined)).toBeUndefined();
});

describe('Metronome', () => {
  function renderMetronome(bpm: number | undefined) {
    const onBpmChange = vi.fn();
    render(<Metronome bpm={bpm} onBpmChange={onBpmChange} />);
    const [minus, plus] = screen.getAllByRole('button');
    return { onBpmChange, minus, plus };
  }

  test('steps the bpm, never below 0', () => {
    const { onBpmChange, minus, plus } = renderMetronome(5);
    fireEvent.click(minus);
    expect(onBpmChange).toHaveBeenLastCalledWith(4);
    fireEvent.click(plus);
    expect(onBpmChange).toHaveBeenLastCalledWith(6);

    cleanup();
    const zero = renderMetronome(0);
    fireEvent.click(zero.minus);
    expect(zero.onBpmChange).toHaveBeenLastCalledWith(0);
  });

  test('without a bpm, minus passes undefined and plus NaN', () => {
    const { onBpmChange, minus, plus } = renderMetronome(undefined);
    fireEvent.click(minus);
    expect(onBpmChange).toHaveBeenLastCalledWith(undefined);
    fireEvent.click(plus);
    expect(onBpmChange).toHaveBeenLastCalledWith(NaN);
  });

  test('parses typed bpms and ignores ones that aren’t numbers', () => {
    const { onBpmChange } = renderMetronome(100);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '12abc' } });
    expect(onBpmChange).toHaveBeenLastCalledWith(12);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.change(input, { target: { value: '-3' } });
    expect(onBpmChange).toHaveBeenCalledTimes(1);
  });
});

test('SetlistNavigation labels the ends and moves by one', () => {
  const songs: Song[] = [
    { ...song, id: 1, name: 'First' },
    { ...song, id: 2, name: 'Second' },
  ];
  const onIndexChange = vi.fn();
  const { rerender } = render(
    <SetlistNavigation songs={songs} index={0} onIndexChange={onIndexChange} />
  );
  expect(screen.getByText('Beginning')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Second'));
  expect(onIndexChange).toHaveBeenLastCalledWith(1);
  rerender(
    <SetlistNavigation songs={songs} index={1} onIndexChange={onIndexChange} />
  );
  expect(screen.getByText('End')).toBeInTheDocument();
  fireEvent.click(screen.getByText('First'));
  expect(onIndexChange).toHaveBeenLastCalledWith(0);
});

describe('SetlistAdjustmentsDrawer', () => {
  const host: User = { id: 7, email: 'host@b.c' };
  const session: Session = { id: 3, setlist_id: 2, user_id: 7, user: host };

  function renderDrawer(activeSession: Session | null, isHost: boolean) {
    const value = {
      sessions: [session],
      activeSessionDetails: { activeSession, isHost, socket: null },
      onStartSession: vi.fn(),
      onEndSession: vi.fn(),
      onLeaveAsMember: vi.fn(),
      // `as`: the drawer reads only these; the rest would be unused stubs.
    } as Partial<SessionsContextValue> as SessionsContextValue;
    const onSongUpdate = vi.fn();
    renderWithProvider(
      <MemoryRouter>
        <SessionsContext.Provider value={value}>
          <SetlistAdjustmentsDrawer
            song={{ ...song, format: { autosize: false } }}
            onSongUpdate={onSongUpdate}
            open
            onClose={() => {}}
            onShowBottomSheet={() => {}}
            setlist={{ id: 2, name: 'Sunday' }}
            currentSongIndex={0}
            onAddNote={() => {}}
          />
        </SessionsContext.Provider>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: {
            currentUser: {
              ...host,
              role: { id: 1, name: 'Member', permissions: [] },
            },
          },
          subscription: { subscription: { isPro: true } },
        },
      }
    );
    return { onSongUpdate };
  }

  function viewSessionsButton() {
    return screen.getByText('View sessions').closest('button');
  }

  test('offers the sessions unless you host the active one', () => {
    renderDrawer(null, false);
    expect(viewSessionsButton()).not.toBeDisabled();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('disables the sessions while you host', () => {
    renderDrawer(session, true);
    expect(viewSessionsButton()).toBeDisabled();
  });

  test('toggles the format', () => {
    const { onSongUpdate } = renderDrawer(null, false);
    fireEvent.click(screen.getByText('Resize lyrics'));
    expect(onSongUpdate).toHaveBeenLastCalledWith('format', {
      autosize: true,
    });
  });
});
