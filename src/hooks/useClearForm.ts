import { useEffect } from 'react';

export default function useClearForm(clearFunction) {
  useEffect(() => {
    return () => clearFunction?.();
  }, [clearFunction]);
}
