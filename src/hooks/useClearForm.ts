import { useEffect } from 'react';

/** Calls `clearFunction` on unmount, or when it changes. */
export default function useClearForm(clearFunction?: (() => void) | null) {
  useEffect(() => {
    return () => clearFunction?.();
  }, [clearFunction]);
}
