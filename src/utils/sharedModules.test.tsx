import { act, render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { renderWithProvider } from './test';
import { setupStore } from '../store/store';
import type { RootState } from '../store/store';
import {
  logOut,
  selectCurrentMember,
  selectHasCredentials,
  setMembership,
  setTeamId,
  updateCurrentUser,
} from '../store/authSlice';
import useUpdates from '../hooks/useUpdates';
import useCopy from '../hooks/useCopy';
import usePermissionsCheck from '../hooks/usePermissionsCheck';
import {
  getCalendarDates,
  getTimeFromDate,
  isValidHour,
  isValidMinute,
} from './date';
import { toMonthYearDate } from './DateUtils';
import { combineParamValues, getModifiedFields, isEmpty } from './ObjectUtils';
import {
  countLines,
  formatChordPro,
  html,
  parseNote,
  parseQuality,
} from './SongUtils';
import { determineCapos } from './capo';
import { getThemeAwareAnnotationColor, setAlpha } from './color.utils';
import { basename, extension, pluralize } from './StringUtils';
import { performanceModes } from './constants';
import type { Role, User } from '../types';

// Pins the behavior of the files converted in CAD-128.

const user: User = { id: 1, email: 'a@b.c', first_name: 'Ann' };
const editor: Role = {
  id: 2,
  name: 'Editor',
  permissions: [{ name: 'Edit songs' }],
};

describe('authSlice', () => {
  afterEach(() => localStorage.clear());

  test('setTeamId keeps the number in state and its string in localStorage', () => {
    const store = setupStore();
    store.dispatch(setTeamId(7));
    expect(store.getState().auth.teamId).toBe(7);
    expect(localStorage.getItem('teamId')).toBe('7');
  });

  test('selectCurrentMember: null until the role loads, then can()', () => {
    const store = setupStore({ auth: { currentUser: user } });
    expect(selectCurrentMember(store.getState())).toBeNull();

    store.dispatch(setMembership({ role: editor }));
    const member = selectCurrentMember(store.getState());
    expect(member?.permissions).toEqual(['Edit songs']);
    expect(member?.first_name).toBe('Ann');
    expect(member?.can('Edit songs')).toBe(true);
    expect(member?.can('Delete songs')).toBe(false);
  });

  test('selectCurrentMember throws with no current user', () => {
    expect(() => selectCurrentMember(setupStore().getState())).toThrow(
      TypeError
    );
  });

  test('updateCurrentUser merges, keeping the role', () => {
    const store = setupStore({
      auth: { currentUser: { ...user, role: editor } },
    });
    store.dispatch(updateCurrentUser({ ...user, first_name: 'Bea' }));
    expect(store.getState().auth.currentUser).toEqual({
      ...user,
      first_name: 'Bea',
      role: editor,
    });
  });

  test('logOut deletes the credentials and user', () => {
    localStorage.setItem('uid', 'UID');
    const store = setupStore({
      auth: { accessToken: 'T', client: 'C', uid: 'U', currentUser: user },
    });
    expect(selectHasCredentials(store.getState())).toBe('U');
    store.dispatch(logOut());
    expect(store.getState().auth).toEqual({});
    expect(localStorage.getItem('uid')).toBeNull();
  });
});

describe('renderWithProvider', () => {
  function CurrentUserName() {
    const name = useSelector(
      (state: RootState) => state.auth.currentUser?.first_name
    );
    return <div>{name ?? 'nobody'}</div>;
  }

  test('fills a new store from preloadedState', () => {
    const { store } = renderWithProvider(<CurrentUserName />, {
      preloadedState: { auth: { currentUser: { first_name: 'Cy' } } },
    });
    expect(screen.getByText('Cy')).toBeInTheDocument();
    expect(store.getState().presenter).toEqual({
      songBeingPresented: {},
      setlistBeingPresented: {},
    });
  });

  test('uses the store it is given', () => {
    const store = setupStore({ auth: { currentUser: user } });
    expect(renderWithProvider(<CurrentUserName />, { store }).store).toBe(
      store
    );
    expect(screen.getByText('Ann')).toBeInTheDocument();
  });
});

describe('hooks', () => {
  test('useUpdates tracks changed fields over the original', () => {
    const results: ReturnType<
      typeof useUpdates<{ name: string; color: string }>
    >[] = [];
    function Probe() {
      results.push(useUpdates({ name: 'Binder', color: 'red' }));
      return null;
    }
    render(<Probe />);
    expect(results[results.length - 1].updates).toEqual({});
    act(() => results[results.length - 1].onChange('color', 'blue'));
    const { updates, updatedValue, clearUpdates } = results[results.length - 1];
    expect(updates).toEqual({ color: 'blue' });
    expect(updatedValue).toEqual({ name: 'Binder', color: 'blue' });
    act(() => clearUpdates());
    expect(results[results.length - 1].updatedValue).toEqual({
      name: 'Binder',
      color: 'red',
    });
  });

  test('useCopy returns the value and a setter', () => {
    function Probe() {
      const [copy, setCopy] = useCopy('original');
      useEffect(() => setCopy('edited'), [setCopy]);
      return <div>{copy}</div>;
    }
    render(<Probe />);
    expect(screen.getByText('edited')).toBeInTheDocument();
  });

  test('usePermissionsCheck asks the current member', () => {
    function Probe() {
      const { can } = usePermissionsCheck();
      return <div>{can('Edit songs') ? 'can edit' : 'cannot edit'}</div>;
    }
    renderWithProvider(<Probe />, {
      preloadedState: { auth: { currentUser: { ...user, role: editor } } },
    });
    expect(screen.getByText('can edit')).toBeInTheDocument();
  });
});

describe('date', () => {
  test('isValidHour and isValidMinute take numbers and strings', () => {
    expect([isValidHour(7), isValidHour('12'), isValidHour('13')]).toEqual([
      true,
      true,
      false,
    ]);
    expect([
      isValidMinute('05'),
      isValidMinute(60),
      isValidMinute('x'),
    ]).toEqual([true, false, false]);
  });

  test('getCalendarDates pads the weeks with null', () => {
    // February 2024 starts on a Thursday and ends on a Thursday.
    const weeks = getCalendarDates(1, 2024);
    const numbers = weeks.map(week => week.map(day => day?.dateNumber ?? null));
    expect(numbers[0]).toEqual([null, null, null, null, 1, 2, 3]);
    expect(numbers[4]).toEqual([25, 26, 27, 28, 29, null, null]);
    expect(numbers[5]).toEqual([]);
    expect(weeks[0][4]).toMatchObject({ isToday: false });
    expect(weeks[0][4]?.fullDate.getDate()).toBe(1);
  });

  test('getTimeFromDate: empty, midnight, and a time', () => {
    expect(getTimeFromDate(null)).toBe('');
    expect(getTimeFromDate(new Date(2024, 0, 1))).toBeNull();
    expect(getTimeFromDate(new Date(2024, 0, 1, 19, 5))).toBe('7:05pm');
  });

  test('toMonthYearDate takes a date or a YYYY-MM-DD string', () => {
    expect(toMonthYearDate(new Date(2024, 5, 30))).toBe('June 2024');
    expect(toMonthYearDate('2024-03-15')).toBe('Mar 2024');
  });
});

describe('ObjectUtils', () => {
  test('getModifiedFields uses a comparator when there is one', () => {
    const incoming = { name: 'B', ids: [1, 2], color: 'red' };
    const original = { name: 'A', ids: [1, 2], color: 'red' };
    expect(
      getModifiedFields(incoming, original, {
        ids: (a: number[], b: number[]) => a.join() !== b.join(),
        missing: () => true,
      })
    ).toEqual({ name: 'B' });
  });

  test('combineParamValues and isEmpty', () => {
    expect(combineParamValues('ids[]=', [1, '2'])).toBe('ids[]=1&ids[]=2');
    expect([isEmpty({}), isEmpty({ a: undefined })]).toEqual([true, false]);
  });
});

describe('SongUtils', () => {
  test('parseQuality and parseNote pass empty keys through', () => {
    expect([parseQuality('Am'), parseQuality('C'), parseQuality('')]).toEqual([
      'm',
      '',
      '',
    ]);
    expect([parseNote('F#m'), parseNote(''), parseNote(undefined)]).toEqual([
      'F#',
      '',
      undefined,
    ]);
  });

  test('html plays the roadmap and colors the chords', () => {
    localStorage.setItem('theme', 'dark');
    const { container } = render(
      <>
        {html({
          content: 'Verse\nG  C\nHello\nChorus\nD\nWorld',
          roadmap: ['Chorus', 'Verse'],
          show_roadmap: true,
          format: { chord_color: 'rgba(0, 0, 0, 1)', bold_chords: true },
        })}
      </>
    );
    localStorage.clear();
    const lines = [...container.querySelectorAll('p')].map(p => p.textContent);
    expect(lines).toEqual(['Chorus', 'D', 'World', 'Verse', 'G  C', 'Hello']);
    const chord = screen.getByText('G');
    // Black chords with no highlight follow the theme.
    expect(chord).toHaveStyle({ color: 'rgba(255,255,255,1)' });
    expect(chord.closest('p')).toHaveClass('whitespace-pre-wrap', 'font-bold');
  });

  test('html returns an empty string without content or format', () => {
    expect(html(undefined)).toBe('');
    expect(html({ content: '', format: {} })).toBe('');
  });

  test('countLines and formatChordPro', () => {
    expect(countLines(undefined)).toBe(0);
    // ChordSheetJS turns the \r\n into a blank line.
    expect(countLines('a\nb\r\nc')).toBe(4);
    expect(formatChordPro('{title: X}\n[G]Hi')).toContain('Hi');
    // Invalid ChordPro comes back as it was.
    expect(formatChordPro('[G')).toBe('[G');
  });
});

test('determineCapos sorts the common keys and throws without a key', () => {
  const { commonKeys, uncommonKeys } = determineCapos('A');
  expect(commonKeys.map(capo => capo.capoKey)).toEqual(['G', 'C', 'D', 'A']);
  expect(commonKeys.map(capo => capo.capoNumber)).toEqual([2, 9, 7, 0]);
  expect(uncommonKeys.map(capo => capo.capoNumber)).toEqual(
    [...uncommonKeys.map(capo => capo.capoNumber)].sort((a, b) => a - b)
  );
  expect(() => determineCapos(undefined)).toThrow(TypeError);
});

test('color utils swap black and white by theme', () => {
  expect(setAlpha('rgba(1,2,3,1)', 0.5)).toBe('rgba(1,2,3,0.5)');
  expect(setAlpha('rgb(1,2,3)', 0.5)).toBe('rgb(1,2,3)');
  expect(getThemeAwareAnnotationColor('rgba(0,0,0,0.4)', true)).toBe(
    'rgba(255,255,255,0.4)'
  );
  expect(getThemeAwareAnnotationColor('rgba(255,255,255,1)', false)).toBe(
    'rgba(0,0,0,1)'
  );
  expect(() => getThemeAwareAnnotationColor('black', true)).toThrow(TypeError);
});

test('StringUtils and constants', () => {
  expect([basename('a.b.pdf'), extension('a.b.pdf'), extension(null)]).toEqual([
    'a',
    'b.pdf',
    undefined,
  ]);
  expect([pluralize('song', 1), pluralize('song', 0)]).toEqual([
    'song',
    'songs',
  ]);
  expect(performanceModes).toEqual({
    PERFORM: 'perform',
    ANNOTATE: 'annotate',
  });
});
