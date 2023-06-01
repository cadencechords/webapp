import { useContext } from 'react';
import { AnnotationsToolbarContext } from '../contexts/AnnotationsToolbarProvider';

export default function useAnnotationsToolbar() {
  const {
    strokeWidth,
    setStrokeWidth,
    color,
    setColor,
    utensil,
    setUtensil,
    annotationChanges,
    setAnnotationChanges,
  } = useContext(AnnotationsToolbarContext);

  return {
    strokeWidth,
    setStrokeWidth,
    color,
    setColor,
    utensil,
    setUtensil,
    annotationChanges,
    setAnnotationChanges,
  };
}
