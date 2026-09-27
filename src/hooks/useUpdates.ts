import { useState } from 'react';
import { isEmpty } from '../utils/ObjectUtils';

/**
 * Tracks edits to `originalValue`: `updates` holds the changed fields and
 * `updatedValue` the value with them applied. Until something changes, both
 * follow `originalValue` (compared as JSON).
 */
export default function useUpdates<T extends object>(originalValue: T) {
  const stringifiedOriginalValue = JSON.stringify(originalValue);
  const [updates, setUpdates] = useState<Partial<T>>({});
  const [updatedValue, setUpdatedValue] = useState(originalValue);
  const isDirty = !isEmpty(updates);

  // Whenever the original changes or the updates are cleared, and nothing is
  // being edited, start over from the original.
  const [previous, setPrevious] = useState({
    stringifiedOriginalValue,
    isDirty,
  });
  if (
    stringifiedOriginalValue !== previous.stringifiedOriginalValue ||
    isDirty !== previous.isDirty
  ) {
    setPrevious({ stringifiedOriginalValue, isDirty });
    if (!isDirty) {
      setUpdatedValue(JSON.parse(stringifiedOriginalValue));
      setUpdates({});
    }
  }

  function onChange<K extends keyof T>(field: K, value: T[K]) {
    setUpdates(previousUpdates => ({ ...previousUpdates, [field]: value }));
    setUpdatedValue(previousValue => ({ ...previousValue, [field]: value }));
  }

  function clearUpdates() {
    setUpdates({});
  }

  return { onChange, updates, updatedValue, clearUpdates };
}
