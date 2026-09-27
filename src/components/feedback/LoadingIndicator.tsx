import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../utils/spring';
import {
  LoadingAnimator,
  MS_PER_SHAPE,
  morphedShape,
  toPath,
} from './loadingShapes';

type LoadingIndicatorProps = {
  /** The indicator's box in px (M3's default is 48; the shape fills 79%). */
  size?: number;
  /** In a primary-container circle, for over content. */
  contained?: boolean;
  /** primary (on-primary-container when contained), or `inherit` for the
      surrounding text color, as in a button. */
  color?: 'primary' | 'inherit';
  className?: string;
};

// The M3 Expressive loading indicator: a shape that morphs through the
// Material shapes while it turns (see loadingShapes.ts). With reduced motion
// it keeps its first shape and only turns, steadily. It's decorative, as the
// dots it replaces were: screen readers announce nothing for it.
export default function LoadingIndicator({
  size = 48,
  contained = false,
  color = 'primary',
  className,
}: LoadingIndicatorProps) {
  const path = useRef<SVGPathElement>(null);
  const radius = (size * 0.79) / 2;

  useEffect(() => {
    const animator = new LoadingAnimator();
    const reduced = prefersReducedMotion();
    let start: number | null = null;
    let frame = requestAnimationFrame(function draw(now) {
      start ??= now;
      let morph = 0;
      let rotation: number;
      if (reduced) {
        // 140° per shape, as the full animation turns on average.
        rotation = (((now - start) / MS_PER_SHAPE) * 140) % 360;
      } else {
        animator.update(now);
        morph = animator.morph;
        rotation = animator.rotation;
      }
      path.current?.setAttribute('d', toPath(morphedShape(morph), radius));
      path.current?.setAttribute('transform', `rotate(${rotation.toFixed(2)})`);
      frame = requestAnimationFrame(draw);
    });
    return () => cancelAnimationFrame(frame);
  }, [radius]);

  return (
    <svg
      aria-hidden="true"
      data-loading-indicator
      width={size}
      height={size}
      viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
      className={classNames(
        'shrink-0',
        color === 'primary' &&
          (contained ? 'text-on-primary-container' : 'text-primary'),
        className
      )}
    >
      {contained && (
        <circle
          r={size / 2}
          className="fill-primary-container"
          data-loading-container
        />
      )}
      <path
        ref={path}
        fill="currentColor"
        d={toPath(morphedShape(0), radius)}
      />
    </svg>
  );
}
