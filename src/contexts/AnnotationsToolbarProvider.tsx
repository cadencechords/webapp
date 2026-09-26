import React, { createContext, useContext, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import useTheme from '../hooks/useTheme';
import type { AnnotationPath } from '../types';

export type AnnotationUtensil = 'pen' | 'highlighter' | 'eraser' | 'scroll';

export interface AnnotationsToolbarContextValue {
  strokeWidth: number;
  setStrokeWidth: Dispatch<SetStateAction<number>>;
  /** An `rgba(...)` color. */
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  utensil: AnnotationUtensil;
  setUtensil: Dispatch<SetStateAction<AnnotationUtensil>>;
  /** The edited paths, not saved yet. */
  annotationChanges: AnnotationPath[];
  setAnnotationChanges: Dispatch<SetStateAction<AnnotationPath[]>>;
}

export const AnnotationsToolbarContext = createContext<
  AnnotationsToolbarContextValue | undefined
>(undefined);

/** The annotations toolbar context. Throws outside an `AnnotationsToolbarProvider`. */
export function useAnnotationsToolbarContext(): AnnotationsToolbarContextValue {
  const value = useContext(AnnotationsToolbarContext);
  if (value === undefined) {
    throw new Error(
      'useAnnotationsToolbarContext must be used inside an AnnotationsToolbarProvider'
    );
  }
  return value;
}

export default function AnnotationsToolbarProvider(props: {
  children?: ReactNode;
}) {
  const { isDark } = useTheme();
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [utensil, setUtensil] = useState<AnnotationUtensil>('pen');
  const [color, setColor] = useState(
    isDark ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)'
  );
  const [annotationChanges, setAnnotationChanges] = useState<AnnotationPath[]>(
    []
  );

  return (
    <AnnotationsToolbarContext.Provider
      {...props}
      value={{
        strokeWidth,
        setStrokeWidth,
        color,
        setColor,
        utensil,
        setUtensil,
        annotationChanges,
        setAnnotationChanges,
      }}
    />
  );
}
