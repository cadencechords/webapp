import { useAnnotationsToolbarContext } from '../contexts/AnnotationsToolbarProvider';

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
  } = useAnnotationsToolbarContext();

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
