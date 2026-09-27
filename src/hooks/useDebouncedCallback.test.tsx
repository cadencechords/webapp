import { act, render } from '@testing-library/react';
import { useEffect } from 'react';
import useDebouncedCallback from './useDebouncedCallback';

type Debounced = ReturnType<typeof useDebouncedCallback<[string]>>;

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

/** Renders the hook with `callback`, recording each debounced function. */
function renderDebounced(
  callback: (value: string) => void,
  onUnmount: 'flush' | 'cancel' = 'flush'
) {
  const seen: Debounced[] = [];
  function Probe({ onCall }: { onCall: (value: string) => void }) {
    const debounced = useDebouncedCallback(onCall, 1000, onUnmount);
    useEffect(() => {
      seen.push(debounced);
    });
    return null;
  }
  const result = render(<Probe onCall={callback} />);
  return {
    ...result,
    seen,
    call: (value: string) => seen[seen.length - 1](value),
    rerender: (newCallback: (value: string) => void) =>
      result.rerender(<Probe onCall={newCallback} />),
  };
}

test('calls once, with the last arguments, after the wait', () => {
  const save = vi.fn<(value: string) => void>();
  const { call } = renderDebounced(save);

  call('A');
  call('Am');
  act(() => {
    vi.advanceTimersByTime(999);
  });
  expect(save).not.toHaveBeenCalled();

  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(save).toHaveBeenCalledTimes(1);
  expect(save).toHaveBeenCalledWith('Am');
});

test('keeps one debounced function, which runs the latest callback', () => {
  const first = vi.fn<(value: string) => void>();
  const second = vi.fn<(value: string) => void>();
  const { call, rerender, seen } = renderDebounced(first);

  call('A');
  rerender(second);
  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(seen).toHaveLength(2);
  expect(seen[1]).toBe(seen[0]);
  expect(first).not.toHaveBeenCalled();
  expect(second).toHaveBeenCalledWith('A');
});

test("'flush' runs a waiting call when the component unmounts", () => {
  const save = vi.fn<(value: string) => void>();
  const { call, unmount } = renderDebounced(save, 'flush');

  call('A');
  unmount();

  expect(save).toHaveBeenCalledTimes(1);
  expect(save).toHaveBeenCalledWith('A');
  act(() => {
    vi.advanceTimersByTime(1000);
  });
  expect(save).toHaveBeenCalledTimes(1);
});

test("'cancel' drops a waiting call when the component unmounts", () => {
  const search = vi.fn<(value: string) => void>();
  const { call, unmount } = renderDebounced(search, 'cancel');

  call('A');
  unmount();
  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(search).not.toHaveBeenCalled();
});

test('unmounting with nothing waiting calls nothing', () => {
  const save = vi.fn<(value: string) => void>();
  const { unmount } = renderDebounced(save, 'flush');

  unmount();

  expect(save).not.toHaveBeenCalled();
});
