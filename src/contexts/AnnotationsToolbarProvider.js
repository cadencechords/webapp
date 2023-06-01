import React, { createContext, useState } from 'react';

export const AnnotationsToolbarContext = createContext();
export default function AnnotationsToolbarProvider(props) {
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [utensil, setUtensil] = useState('pen');
  const [color, setColor] = useState('rgba(0,0,0,1)');
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
