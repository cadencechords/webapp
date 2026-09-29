import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ComponentProps } from 'react';
import presenterReducer, {
  adjustSongBeingPresented,
  selectSetlistBeingPresented,
  selectSongBeingPresented,
  setSetlistBeingPresented,
  setSongBeingPresented,
} from '../store/presenterSlice';
import { setupStore } from '../store/store';
import type MetronomeTool from '../tools/metronome';
import { findSessionCurrentUserIsHosting } from '../utils/sessions';
import Metronome, { MAX_BPM, MIN_BPM, sliderBpm } from './Metronome';
import SetlistNavigation from './SetlistNavigation';
import SetlistAdjustmentsDrawer from './SetlistAdjustmentsDrawer';
import SessionsSheet from './SessionsSheet';
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
    start = vi.fn<MetronomeTool['start']>();
    stop = vi.fn<MetronomeTool['stop']>();
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
    const onBpmChange =
      vi.fn<ComponentProps<typeof Metronome>['onBpmChange']>();
    render(<Metronome bpm={bpm} onBpmChange={onBpmChange} />);
    const minus = screen.getByRole('button', { name: 'Decrease tempo' });
    const plus = screen.getByRole('button', { name: 'Increase tempo' });
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

  test('sets the bpm from the slider', () => {
    const { onBpmChange } = renderMetronome(100);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', String(MIN_BPM));
    expect(slider).toHaveAttribute('max', String(MAX_BPM));
    expect(slider).toHaveValue('100');
    fireEvent.change(slider, { target: { value: '140' } });
    expect(onBpmChange).toHaveBeenLastCalledWith(140);
  });

  test('keeps the slider in range, at the low end without a bpm', () => {
    expect(sliderBpm(120)).toBe(120);
    expect(sliderBpm(500)).toBe(MAX_BPM);
    expect(sliderBpm(10)).toBe(MIN_BPM);
    expect(sliderBpm(undefined)).toBe(MIN_BPM);
    expect(sliderBpm(0)).toBe(MIN_BPM);
    expect(sliderBpm(NaN)).toBe(MIN_BPM);

    renderMetronome(undefined);
    expect(screen.getByRole('slider')).toHaveValue(String(MIN_BPM));
  });

  test('starts and stops with a toggle button', () => {
    renderMetronome(100);
    const start = screen.getByRole('button', { name: 'Start metronome' });
    expect(start).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(start);
    const stop = screen.getByRole('button', { name: 'Stop metronome' });
    expect(stop).toHaveAttribute('aria-pressed', 'true');

    // Tapping the tempo stops it.
    fireEvent.click(screen.getByRole('button', { name: 'Tap' }));
    expect(
      screen.getByRole('button', { name: 'Start metronome' })
    ).toHaveAttribute('aria-pressed', 'false');
  });
});

test('SetlistNavigation shows where the song is and moves by one, stopping at the ends', () => {
  const songs: Song[] = [
    { ...song, id: 1, name: 'First' },
    { ...song, id: 2, name: 'Second' },
  ];
  const onIndexChange =
    vi.fn<ComponentProps<typeof SetlistNavigation>['onIndexChange']>();
  const { rerender } = render(
    <SetlistNavigation songs={songs} index={0} onIndexChange={onIndexChange} />
  );
  expect(screen.getByText('1 of 2')).toBeInTheDocument();
  expect(screen.getByText('Next: Second')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Previous song' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Next: Second' }));
  expect(onIndexChange).toHaveBeenLastCalledWith(1);

  rerender(
    <SetlistNavigation songs={songs} index={1} onIndexChange={onIndexChange} />
  );
  expect(screen.getByText('2 of 2')).toBeInTheDocument();
  expect(screen.getByText('End of set')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Next song' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Previous: First' }));
  expect(onIndexChange).toHaveBeenLastCalledWith(0);
});

describe('SetlistAdjustmentsDrawer', () => {
  const host: User = { id: 7, email: 'host@b.c' };
  const session: Session = { id: 3, setlist_id: 2, user_id: 7, user: host };

  function renderDrawer(activeSession: Session | null, isHost: boolean) {
    const value = {
      sessions: [session],
      activeSessionDetails: { activeSession, isHost, socket: null },
      onStartSession: vi.fn<SessionsContextValue['onStartSession']>(),
      onEndSession: vi.fn<SessionsContextValue['onEndSession']>(),
      onLeaveAsMember: vi.fn<SessionsContextValue['onLeaveAsMember']>(),
      // `as`: the drawer reads only these; the rest would be unused stubs.
    } as Partial<SessionsContextValue> as SessionsContextValue;
    const onSongUpdate =
      vi.fn<ComponentProps<typeof SetlistAdjustmentsDrawer>['onSongUpdate']>();
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

  test('groups the settings, with a switch per display setting', () => {
    const { onSongUpdate } = renderDrawer(session, false);
    expect(
      screen.getAllByRole('heading').map(heading => heading.textContent)
    ).toEqual(['Song settings', 'Display', 'Tools', 'Session']);
    expect(
      screen.getByRole('switch', { name: 'Resize lyrics' })
    ).not.toBeChecked();
    expect(screen.getByRole('switch', { name: 'Show chords' })).toBeChecked();

    fireEvent.click(screen.getByRole('switch', { name: 'Show chords' }));
    expect(onSongUpdate).toHaveBeenLastCalledWith('format', {
      autosize: false,
      chords_hidden: true,
    });
    expect(screen.getByRole('button', { name: 'Leave session' })).toHaveClass(
      'text-error'
    );
  });
});

describe('SessionsSheet', () => {
  const me: User = { id: 1, email: 'me@b.c' };
  const host: User = {
    id: 7,
    email: 'host@b.c',
    first_name: 'Sam',
    last_name: 'Lee',
  };
  const other: User = {
    id: 8,
    email: 'kim@b.c',
    first_name: 'Kim',
    last_name: 'Ro',
  };
  const followed: Session = { id: 3, setlist_id: 2, user_id: 7, user: host };
  const another: Session = { id: 4, setlist_id: 2, user_id: 8, user: other };

  function renderSheet(sessions: Session[], activeSession: Session | null) {
    const value = {
      sessions,
      activeSessionDetails: { activeSession, isHost: false, socket: null },
      onJoinAsMember: vi.fn<SessionsContextValue['onJoinAsMember']>(),
      onLeaveAsMember: vi.fn<SessionsContextValue['onLeaveAsMember']>(),
      // `as`: the sheet reads only these.
    } as Partial<SessionsContextValue> as SessionsContextValue;
    const onClose = vi.fn<() => void>();
    renderWithProvider(
      <SessionsContext.Provider value={value}>
        <SessionsSheet className="" onClose={onClose} />
      </SessionsContext.Provider>,
      { preloadedState: { auth: { currentUser: me } } }
    );
    return { ...value, onClose };
  }

  test('marks the session you follow, and joins another', () => {
    const { onJoinAsMember, onClose } = renderSheet(
      [followed, another],
      followed
    );
    expect(
      screen.getByRole('heading', { name: 'Sessions' })
    ).toBeInTheDocument();
    expect(screen.getByText('Host · Following')).toBeInTheDocument();
    expect(
      screen.getByText('Sam Lee').closest('.list-segmented > *')
    ).toHaveClass('bg-secondary-container');
    expect(
      screen.getByText('Kim Ro').closest('.list-segmented > *')
    ).not.toHaveClass('bg-secondary-container');

    fireEvent.click(screen.getByRole('button', { name: 'Join session' }));
    expect(onJoinAsMember).toHaveBeenCalledWith(another);
    expect(onClose).toHaveBeenCalled();
  });

  test('says when there are no sessions to join', () => {
    renderSheet([], null);
    expect(screen.getByText('No sessions to join')).toBeInTheDocument();
  });
});
