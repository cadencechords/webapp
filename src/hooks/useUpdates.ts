import { useEffect, useState } from 'react';
import { isEmpty } from '../utils/ObjectUtils';

export default function useUpdates(originalValue) {
  const stringifiedOriginalValue = JSON.stringify(originalValue);
  const [updates, setUpdates] = useState({});
  const [updatedValue, setUpdatedValue] = useState(originalValue);
  const isDirty = !isEmpty(updates);

  useEffect(() => {
    if (!isDirty) {
      setUpdatedValue(JSON.parse(stringifiedOriginalValue));
      setUpdates({});
    }
  }, [stringifiedOriginalValue, isDirty]);

  function onChange(field, value) {
    setUpdates(previousUpdates => ({ ...previousUpdates, [field]: value }));
    setUpdatedValue(previousValue => ({ ...previousValue, [field]: value }));
  }

  function clearUpdates() {
    setUpdates({});
  }

  return { onChange, updates, updatedValue, clearUpdates };
}
