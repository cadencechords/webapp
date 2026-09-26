import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

/** Local state that starts as `originalValue` and resets when it changes. */
export default function useCopy<T>(
  originalValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [copy, setCopy] = useState(originalValue);
  const [previousOriginalValue, setPreviousOriginalValue] =
    useState(originalValue);
  if (!Object.is(originalValue, previousOriginalValue)) {
    setPreviousOriginalValue(originalValue);
    setCopy(originalValue);
  }

  return [copy, setCopy];
}
