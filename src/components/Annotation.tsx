import React from 'react';
import useTheme from '../hooks/useTheme';
import { getThemeAwareAnnotationColor } from '../utils/color.utils';
import type { AnnotationPath } from '../types';

type AnnotationProps = {
  annotation: AnnotationPath;
};

export default function Annotation({ annotation }: AnnotationProps) {
  const { isDark } = useTheme();

  return (
    <path
      d={annotation.path}
      strokeWidth={annotation.stroke_width}
      stroke={getThemeAwareAnnotationColor(annotation.color, isDark)}
      fill="transparent"
      className="z-50"
    />
  );
}
