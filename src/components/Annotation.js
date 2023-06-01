import React from 'react';
import useTheme from '../hooks/useTheme';
import { getThemeAwareAnnotationColor } from '../utils/color.utils';

export default function Annotation({ annotation }) {
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
