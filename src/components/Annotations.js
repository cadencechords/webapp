import React from 'react';
import Annotation from './Annotation';
import AnnotationCanvas from './AnnotationCanvas';
import usePerformanceMode from '../hooks/usePerformanceMode';
import useAnnotationsToolbar from '../hooks/useAnnotationsToolbar';

export default function Annotations({ annotations = [] }) {
  const { isAnnotating } = usePerformanceMode();
  const { setAnnotationChanges } = useAnnotationsToolbar();

  if (isAnnotating) {
    return (
      <AnnotationCanvas
        defaultAnnotations={annotations}
        onChange={setAnnotationChanges}
      />
    );
  }

  if (annotations.length === 0) return null;

  return (
    <svg className="absolute top-0 left-0 w-full h-full">
      {annotations.map(annotation => (
        <Annotation key={annotation.id} annotation={annotation} />
      ))}
    </svg>
  );
}
