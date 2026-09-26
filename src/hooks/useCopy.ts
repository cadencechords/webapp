import { useEffect, useState } from 'react';

export default function useCopy(originalValue) {
  const [copy, setCopy] = useState(originalValue);

  useEffect(() => {
    setCopy(originalValue);
  }, [originalValue]);

  return [copy, setCopy];
}
