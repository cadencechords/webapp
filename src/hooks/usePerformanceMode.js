import { useCallback } from 'react';
import { usePerformanceModeContext } from '../contexts/PerformanceModeProvider';
import { performanceModes } from '../utils/constants';
export default function usePerformanceMode() {
  const { mode, setMode } = usePerformanceModeContext();

  const isPerforming = mode === performanceModes.PERFORM;
  const isAnnotating = mode === performanceModes.ANNOTATE;

  const beginAnnotating = useCallback(() => {
    setMode(performanceModes.ANNOTATE);
  }, [setMode]);

  const beginPerforming = useCallback(() => {
    setMode(performanceModes.PERFORM);
  }, [setMode]);

  return {
    mode,
    setMode,
    isPerforming,
    isAnnotating,
    beginAnnotating,
    beginPerforming,
  };
}
