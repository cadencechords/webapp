import React, { createContext, useContext, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { performanceModes } from '../utils/constants';

/** One of the `performanceModes` values: 'perform' or 'annotate'. */
export type PerformanceMode =
  (typeof performanceModes)[keyof typeof performanceModes];

export interface PerformanceModeContextValue {
  mode: PerformanceMode;
  setMode: Dispatch<SetStateAction<PerformanceMode>>;
}

export const PerformanceModeContext = createContext<
  PerformanceModeContextValue | undefined
>(undefined);

/** The performance mode context. Throws outside a `PerformanceModeProvider`. */
export function usePerformanceModeContext(): PerformanceModeContextValue {
  const value = useContext(PerformanceModeContext);
  if (value === undefined) {
    throw new Error(
      'usePerformanceModeContext must be used inside a PerformanceModeProvider'
    );
  }
  return value;
}

export default function PerformanceModeProvider(props: {
  children?: ReactNode;
}) {
  const [mode, setMode] = useState<PerformanceMode>(performanceModes.PERFORM);

  return (
    <PerformanceModeContext.Provider {...props} value={{ mode, setMode }} />
  );
}
