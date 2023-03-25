import React from 'react';
import { shapeOptions } from '../utils/constants';

export default function ShapeMarking({ marking }) {
  const ShapeSvg = shapeOptions[marking.content];
  if (!ShapeSvg) return null;

  return (
    <ShapeSvg
      style={{ height: '100px', width: '100px' }}
      className="text-black dark:text-white"
    />
  );
}
