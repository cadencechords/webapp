import React, { forwardRef } from 'react';
import { shapeOptions } from '../utils/constants';
import classNames from 'classnames';

const ShapeMarking = forwardRef(({ marking, style, className }, ref) => {
  const ShapeSvg = shapeOptions[marking.content];
  if (!ShapeSvg) return null;

  return (
    <ShapeSvg
      ref={ref}
      style={{ height: '60px', width: '60px', ...style }}
      className={classNames('text-black dark:text-white', className)}
    />
  );
});

export default ShapeMarking;
