import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { shapeOptions } from '../utils/constants';
import classNames from 'classnames';
import type { Marking } from '../types';

type ShapeMarkingProps = {
  marking: Marking;
  style?: CSSProperties;
  className?: string;
};

const ShapeMarking = forwardRef<SVGSVGElement, ShapeMarkingProps>(
  ({ marking, style, className }, ref) => {
    const ShapeSvg = shapeOptions[marking.content];
    if (!ShapeSvg) return null;

    return (
      <ShapeSvg
        ref={ref}
        style={{ height: '60px', width: '60px', ...style }}
        className={classNames('text-black dark:text-white', className)}
      />
    );
  }
);

export default ShapeMarking;
