import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { shapeOptions } from '../utils/constants';
import classNames from 'classnames';
import type { Marking } from '../types';

// Looked up by any content: an unknown one is undefined, and ShapeMarking
// renders null.
const SHAPES_BY_NAME: Partial<
  Record<string, (typeof shapeOptions)[keyof typeof shapeOptions]>
> = shapeOptions;

type ShapeMarkingProps = {
  marking: Marking;
  style?: CSSProperties;
  className?: string;
};

const ShapeMarking = forwardRef<SVGSVGElement, ShapeMarkingProps>(
  ({ marking, style, className }, ref) => {
    const ShapeSvg = marking.content && SHAPES_BY_NAME[marking.content];
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
