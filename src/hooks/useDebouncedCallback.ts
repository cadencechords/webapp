import { useEffect, useState } from 'react';
import _ from 'lodash';

/**
 * A debounced `callback`, created once. Each call waits `wait` ms, and runs
 * the latest `callback` with the latest arguments.
 *
 * `onUnmount` says what happens to a call still waiting when the component
 * unmounts: `'flush'` runs it straight away (a pending save still happens),
 * `'cancel'` drops it (a pending search is no longer wanted).
 */
export default function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait: number,
  onUnmount: 'flush' | 'cancel'
) {
  const [latest] = useState(() => debounceLatest(callback, wait));

  // After each render, so a waiting call runs the newest callback.
  useEffect(() => {
    latest.setCallback(callback);
  });

  const { debounced } = latest;
  useEffect(
    () => () => {
      if (onUnmount === 'flush') debounced.flush();
      else debounced.cancel();
    },
    [debounced, onUnmount]
  );

  return debounced;
}

/**
 * A debounced function that calls whichever callback `setCallback` last
 * gave it, when the wait ends.
 */
function debounceLatest<Args extends unknown[]>(
  initialCallback: (...args: Args) => void,
  wait: number
) {
  let callback = initialCallback;
  return {
    debounced: _.debounce((...args: Args) => callback(...args), wait),
    setCallback(newCallback: (...args: Args) => void) {
      callback = newCallback;
    },
  };
}
