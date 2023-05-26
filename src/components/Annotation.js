import React from 'react';

export default function Annotation({ annotation }) {
  return (
    <path
      d={annotation.path}
      strokeWidth={annotation.stroke_width}
      stroke={annotation.color}
      fill="transparent"
      className="z-50"
    />
  );
}
