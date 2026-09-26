import { act, render } from '@testing-library/react';
import React, { useContext } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider, { ThemeContext, useThemeContext } from './ThemeProvider';
import PerformanceModeProvider, {
  PerformanceModeContext,
  usePerformanceModeContext,
} from './PerformanceModeProvider';
import AnnotationsToolbarProvider, {
  AnnotationsToolbarContext,
  useAnnotationsToolbarContext,
} from './AnnotationsToolbarProvider';
import SongEditorProvider, {
  SongEditorContext,
  useSongEditorContext,
} from './SongEditorProvider';
import EventFormProvider, {
  EventFormContext,
  useEventFormContext,
} from './EventFormProvider';
import SessionsProvider, {
  SessionsContext,
  useSessionsContext,
} from './SessionsProvider';
import useTheme from '../hooks/useTheme';
import usePerformanceMode from '../hooks/usePerformanceMode';
import useAnnotationsToolbar from '../hooks/useAnnotationsToolbar';
import useSongEditor from '../hooks/useSongEditor';
import useEventForm from '../hooks/forms/useEventForm';
import SessionsSheet from '../components/SessionsSheet';
import { renderWithProvider } from '../utils/test';

/** Renders `hook` inside `Wrapper` and returns a live view of its value. */
function renderHookValue<T>(
  hook: () => T,
  Wrapper: (props: { children?: ReactNode }) => ReactElement,
  renderFn: (ui: ReactElement) => unknown = render
) {
  const result: { current: T | undefined } = { current: undefined };
  function Probe() {
    result.current = hook();
    return null;
  }
  renderFn(
    <Wrapper>
      <Probe />
    </Wrapper>
  );
  return result;
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('ThemeProvider', () => {
  test('starts light unless localStorage says dark', () => {
    expect(
      renderHookValue(() => useContext(ThemeContext), ThemeProvider).current
        ?.isDark
    ).toBe(false);

    localStorage.setItem('theme', 'dark');
    expect(
      renderHookValue(() => useContext(ThemeContext), ThemeProvider).current
        ?.isDark
    ).toBe(true);
  });

  test('setIsDark saves the theme and toggles the dark class', () => {
    const result = renderHookValue(
      () => useContext(ThemeContext),
      ThemeProvider
    );

    act(() => result.current?.setIsDark(true));

    expect(result.current?.isDark).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => result.current?.setIsDark(false));

    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

test('PerformanceModeProvider starts in perform mode', () => {
  const result = renderHookValue(
    () => useContext(PerformanceModeContext),
    PerformanceModeProvider
  );
  expect(result.current?.mode).toBe('perform');

  act(() => result.current?.setMode('annotate'));
  expect(result.current?.mode).toBe('annotate');
});

describe('AnnotationsToolbarProvider', () => {
  function Providers({ children }: { children?: ReactNode }) {
    return (
      <ThemeProvider>
        <AnnotationsToolbarProvider>{children}</AnnotationsToolbarProvider>
      </ThemeProvider>
    );
  }

  test('starts with a thin black pen and no changes', () => {
    const value = renderHookValue(
      () => useContext(AnnotationsToolbarContext),
      Providers
    ).current;
    expect(value?.strokeWidth).toBe(2);
    expect(value?.utensil).toBe('pen');
    expect(value?.color).toBe('rgba(0,0,0,1)');
    expect(value?.annotationChanges).toEqual([]);
  });

  test('starts with a white pen in dark mode', () => {
    localStorage.setItem('theme', 'dark');
    expect(
      renderHookValue(() => useContext(AnnotationsToolbarContext), Providers)
        .current?.color
    ).toBe('rgba(255,255,255,1)');
  });
});

test('SongEditorProvider starts empty and not busy', () => {
  const value = renderHookValue(
    () => useContext(SongEditorContext),
    SongEditorProvider
  ).current;
  expect(value?.loading).toBe(false);
  expect(value?.saving).toBe(false);
  expect(value?.song).toBeUndefined();
  expect(value?.editedContent).toBeUndefined();
  expect(value?.editedFormat).toBeUndefined();
});

describe('EventFormProvider', () => {
  test('starts with a blank, invalid form', () => {
    const value = renderHookValue(
      () => useContext(EventFormContext),
      EventFormProvider
    ).current;
    expect(value?.form).toEqual({
      title: '',
      description: '',
      color: 'blue',
      memberships: [],
      remind_number_of_hours_before: 1,
    });
    expect(value?.isValid).toBe(false);
  });

  test('is valid once it has a title and a start date', () => {
    const result = renderHookValue(
      () => useContext(EventFormContext),
      EventFormProvider
    );

    act(() =>
      result.current?.setForm(form => ({ ...form, title: 'Rehearsal' }))
    );
    expect(result.current?.isValid).toBe(false);

    act(() =>
      result.current?.setForm(form => ({ ...form, startDate: '2024-05-01' }))
    );
    expect(result.current?.isValid).toBe(true);
  });

  test('populateForm fills the form from a saved event', () => {
    const result = renderHookValue(
      () => useContext(EventFormContext),
      EventFormProvider
    );

    act(() =>
      result.current?.populateForm({
        id: 5,
        title: 'Service',
        start_time: '2024-05-01T00:00:00',
      })
    );

    expect(result.current?.form).toMatchObject({
      id: 5,
      title: 'Service',
      description: '',
      color: 'blue',
      startDate: '2024-05-01',
      startTime: '',
    });
    expect(result.current?.isValid).toBe(true);
  });
});

test('SessionsProvider starts with no sessions and no active session', () => {
  const result = renderHookValue(
    () => useContext(SessionsContext),
    SessionsProvider,
    ui =>
      renderWithProvider(ui, {
        preloadedState: { auth: { currentUser: { id: 1 } } },
      })
  );
  expect(result.current?.sessions).toEqual([]);
  expect(result.current?.activeSessionDetails).toEqual({
    isHost: false,
    activeSession: null,
    socket: null,
  });

  act(() =>
    result.current?.setSessions([{ id: 3, setlist_id: 2, user_id: 9 }])
  );
  expect(result.current?.sessions).toEqual([
    { id: 3, setlist_id: 2, user_id: 9 },
  ]);
});

// Every consumer destructures the context value, so outside its provider it
// has always thrown.
describe('consumers throw outside their provider', () => {
  function NoProvider({ children }: { children?: ReactNode }) {
    return <MemoryRouter>{children}</MemoryRouter>;
  }

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test.each([
    ['useTheme', useTheme],
    ['usePerformanceMode', usePerformanceMode],
    ['useAnnotationsToolbar', useAnnotationsToolbar],
    ['useSongEditor', useSongEditor],
    ['useEventForm', useEventForm],
  ])('%s', (_, hook: () => unknown) => {
    expect(() => renderHookValue(hook, NoProvider)).toThrow();
  });

  test('SessionsSheet', () => {
    expect(() =>
      render(<SessionsSheet className="" onClose={() => {}} />)
    ).toThrow();
  });

  // New in CAD-121: the context hooks name the missing provider.
  test.each([
    ['useThemeContext', useThemeContext, 'ThemeProvider'],
    [
      'usePerformanceModeContext',
      usePerformanceModeContext,
      'PerformanceModeProvider',
    ],
    [
      'useAnnotationsToolbarContext',
      useAnnotationsToolbarContext,
      'AnnotationsToolbarProvider',
    ],
    ['useSongEditorContext', useSongEditorContext, 'SongEditorProvider'],
    ['useEventFormContext', useEventFormContext, 'EventFormProvider'],
    ['useSessionsContext', useSessionsContext, 'SessionsProvider'],
  ])('%s names its provider', (_, hook: () => unknown, provider: string) => {
    expect(() => renderHookValue(hook, NoProvider)).toThrow(
      `must be used inside a${/^[AEIOU]/.test(provider) ? 'n' : ''} ${provider}`
    );
  });
});

// New in CAD-121.
test('the context hooks return the provided value', () => {
  expect(renderHookValue(useThemeContext, ThemeProvider).current?.isDark).toBe(
    false
  );
});
