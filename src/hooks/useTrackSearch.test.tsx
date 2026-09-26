import { act, render, screen } from '@testing-library/react';
import useTrackSearch from './useTrackSearch';
import { reportError } from '../utils/error';

vi.mock('../utils/error', () => ({ reportError: vi.fn() }));

// The track search lists' loading, results and empty states (CAD-144).

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/** A search whose calls each resolve or reject when the test says so. */
function controlledSearch() {
  const calls: {
    query: string;
    resolve: (results: string[]) => void;
    reject: (error: Error) => void;
  }[] = [];
  const search = vi.fn<(query: string) => Promise<string[]>>(
    query =>
      new Promise((resolve, reject) => calls.push({ query, resolve, reject }))
  );
  return { search, calls };
}

/**
 * Renders the hook for `query`. `result.current` is its latest return value,
 * and `rerender` passes a new query.
 */
function renderSearch(
  query: string,
  search: (query: string) => Promise<string[]>
) {
  function Probe({ query }: { query: string }) {
    return <output>{JSON.stringify(useTrackSearch(query, search))}</output>;
  }
  const { rerender } = render(<Probe query={query} />);
  return {
    result: {
      get current(): ReturnType<typeof useTrackSearch<string>> {
        return JSON.parse(screen.getByRole('status').textContent ?? '');
      },
    },
    rerender: ({ query }: { query: string }) =>
      rerender(<Probe query={query} />),
  };
}

test('loads from the query change until its search settles', async () => {
  const { search, calls } = controlledSearch();
  const { result } = renderSearch('Holy', search);
  expect(result.current).toEqual({ results: [], loading: true });

  act(() => {
    vi.advanceTimersByTime(799);
  });
  expect(search).not.toHaveBeenCalled();
  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(search).toHaveBeenCalledWith('Holy');

  await act(async () => calls[0].resolve(['Holy, Holy, Holy']));
  expect(result.current).toEqual({
    results: ['Holy, Holy, Holy'],
    loading: false,
  });
});

test('keeps loading, not stale results, until the newest query settles', async () => {
  const { search, calls } = controlledSearch();
  const { result, rerender } = renderSearch('Hol', search);
  act(() => {
    vi.advanceTimersByTime(800);
  });

  rerender({ query: 'Holy' });
  await act(async () => calls[0].resolve(['Hold On']));
  expect(result.current).toEqual({ results: [], loading: true });

  act(() => {
    vi.advanceTimersByTime(800);
  });
  await act(async () => calls[1].resolve(['Holy, Holy, Holy']));
  expect(result.current).toEqual({
    results: ['Holy, Holy, Holy'],
    loading: false,
  });
});

test('loads again, over the previous results, when the query changes', async () => {
  const { search, calls } = controlledSearch();
  const { result, rerender } = renderSearch('Holy', search);
  act(() => {
    vi.advanceTimersByTime(800);
  });
  await act(async () => calls[0].resolve(['Holy, Holy, Holy']));

  rerender({ query: 'Holy Spirit' });
  expect(result.current).toEqual({
    results: ['Holy, Holy, Holy'],
    loading: true,
  });
});

test('going back to the settled query shows its results, then refreshes them', async () => {
  const { search, calls } = controlledSearch();
  const { result, rerender } = renderSearch('Holy', search);
  act(() => {
    vi.advanceTimersByTime(800);
  });
  await act(async () => calls[0].resolve(['Holy, Holy, Holy']));

  rerender({ query: 'Holy S' });
  rerender({ query: 'Holy' });
  expect(result.current).toEqual({
    results: ['Holy, Holy, Holy'],
    loading: false,
  });

  act(() => {
    vi.advanceTimersByTime(800);
  });
  expect(search).toHaveBeenCalledTimes(2);
  expect(search).toHaveBeenLastCalledWith('Holy');
  expect(result.current.loading).toBe(false);
  await act(async () => calls[1].resolve(['Holy Is the Lord']));
  expect(result.current).toEqual({
    results: ['Holy Is the Lord'],
    loading: false,
  });
});

test('searches only once typing pauses', () => {
  const { search } = controlledSearch();
  const { rerender } = renderSearch('H', search);
  act(() => {
    vi.advanceTimersByTime(500);
  });
  rerender({ query: 'Ho' });
  act(() => {
    vi.advanceTimersByTime(800);
  });
  expect(search).toHaveBeenCalledTimes(1);
  expect(search).toHaveBeenCalledWith('Ho');
});

test('an empty result is empty, not loading', async () => {
  const { search, calls } = controlledSearch();
  const { result } = renderSearch('zzz', search);
  act(() => {
    vi.advanceTimersByTime(800);
  });
  await act(async () => calls[0].resolve([]));
  expect(result.current).toEqual({ results: [], loading: false });
});

test('a failed search stops loading and keeps the previous results', async () => {
  const { search, calls } = controlledSearch();
  const { result, rerender } = renderSearch('Holy', search);
  act(() => {
    vi.advanceTimersByTime(800);
  });
  await act(async () => calls[0].resolve(['Holy, Holy, Holy']));

  rerender({ query: 'Holy Spirit' });
  act(() => {
    vi.advanceTimersByTime(800);
  });
  const error = new Error('offline');
  await act(async () => calls[1].reject(error));
  expect(reportError).toHaveBeenCalledWith(error);
  expect(result.current).toEqual({
    results: ['Holy, Holy, Holy'],
    loading: false,
  });
});

test('an empty query is never searched', () => {
  const { search } = controlledSearch();
  const { result } = renderSearch('', search);
  act(() => {
    vi.advanceTimersByTime(800);
  });
  expect(search).not.toHaveBeenCalled();
  // As before: the list shows the spinner until there's a query.
  expect(result.current.loading).toBe(true);
});
