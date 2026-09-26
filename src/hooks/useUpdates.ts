import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!isDirty) {
      setUpdatedValue(JSON.parse(stringifiedOriginalValue));
      setUpdates({});
    }
  }, [stringifiedOriginalValue, isDirty]);

  function onChange<K extends keyof T>(field: K, value: T[K]) {
    setUpdates(previousUpdates => ({ ...previousUpdates, [field]: value }));
    setUpdatedValue(previousValue => ({ ...previousValue, [field]: value }));
  }

  function clearUpdates() {
    setUpdates({});
  }

  return { onChange, updates, updatedValue, clearUpdates };
}
