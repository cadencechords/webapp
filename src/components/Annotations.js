import React from 'react';
import Annotation from './Annotation';

export default function Annotations({ annotations = [] }) {
  if (annotations.length === 0) return null;

  return (
    <svg className="absolute top-0 left-0 z-10 w-full h-full">
      {annotations.map(annotation => (
        <Annotation key={annotation.id} annotation={annotation} />
      ))}
    </svg>
  );
}
