import React, { createContext, useState } from 'react';
import useTheme from '../hooks/useTheme';

export const AnnotationsToolbarContext = createContext();
export default function AnnotationsToolbarProvider(props) {
  const { isDark } = useTheme();
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [utensil, setUtensil] = useState('pen');
  const [color, setColor] = useState(
    isDark ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)'
  );
  const [annotationChanges, setAnnotationChanges] = useState([]);

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
