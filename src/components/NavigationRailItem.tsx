import classNames from 'classnames';
import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

type NavigationRailItemProps = {
  text: string;
  to: string;
  /** Filled, selected or not. */
  icon: ReactNode;
  exact?: boolean;
};

// The indicator and the state layer share one shape: 56×32 around the icon
// in the collapsed rail (md), and a 56dp pill around icon and label in the
// expanded one (lg).
const PILL =
  'absolute rounded-full top-1 left-1/2 w-14 h-8 -translate-x-1/2 lg:inset-0 lg:w-auto lg:h-auto lg:translate-x-0';

const spring = (speed: 'fast-spatial' | 'fast-effects') =>
  `var(--md-sys-motion-duration-${speed}) var(--md-sys-motion-easing-${speed})`;

// The indicator grows out of the icon on the fast-spatial spring (from its
// center collapsed, from its left edge expanded) and fades in. Leaving, it
// shrinks and fades on the effects curve, which doesn't overshoot.
export const GROW: CSSProperties = {
  transition: `scale ${spring('fast-spatial')}, opacity ${spring('fast-effects')}`,
};
export const SHRINK: CSSProperties = {
  transition: `scale ${spring('fast-effects')}, opacity ${spring('fast-effects')}`,
};

// Tapping the destination you're already on (or the search FAB) swells it and
// lets it spring back, so the tap still registers. The motion tokens are read
// at tap time: reduced motion sets their durations to 0, which skips it.
export function pulse(indicator: HTMLElement | null) {
  if (!indicator?.animate) return;
  const style = getComputedStyle(indicator);
  const duration = parseFloat(
    style.getPropertyValue('--md-sys-motion-duration-fast-spatial')
  );
  if (!duration) return;
  indicator.animate(
    [
      { scale: '1', transformOrigin: 'center' },
      { scale: '1.05', transformOrigin: 'center', offset: 0.3 },
      { scale: '1', transformOrigin: 'center' },
    ],
    {
      duration,
      easing: style.getPropertyValue('--md-sys-motion-easing-fast-spatial'),
    }
  );
}

/** A rail action (feedback, account) at the foot of the rail: a 48dp circle
    collapsed, a 48dp pill with its label expanded. For a popover's button. */
export const RAIL_ACTION_ROW = 'flex items-center px-6 py-1 lg:px-3';
export const RAIL_ACTION =
  'flex items-center justify-center w-12 h-12 rounded-full state-layer text-on-surface-variant lg:justify-start lg:w-full lg:gap-3 lg:px-3';
export const RAIL_ACTION_LABEL =
  'hidden truncate lg:inline font-plain text-label-large text-on-surface';

/** One destination of the M3E navigation rail. */
export default function NavigationRailItem({
  text,
  to,
  icon,
  exact = false,
}: NavigationRailItemProps) {
  const isCurrentRoute = !!useRouteMatch({ path: to, exact });
  const indicatorRef = useRef<HTMLSpanElement>(null);

  return (
    <Link
      to={to}
      aria-current={isCurrentRoute ? 'page' : undefined}
      onClick={() => {
        if (isCurrentRoute) pulse(indicatorRef.current);
      }}
      className={classNames(
        'group relative flex flex-col items-center gap-1 py-1 outline-none',
        'lg:flex-row lg:gap-3 lg:w-fit lg:h-14 lg:px-4 lg:py-0',
        isCurrentRoute ? 'text-on-primary-container' : 'text-on-surface-variant'
      )}
    >
      <span
        ref={indicatorRef}
        aria-hidden="true"
        data-rail-indicator
        className={classNames(
          PILL,
          'bg-primary-container origin-center lg:origin-left',
          isCurrentRoute ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
        )}
        style={isCurrentRoute ? GROW : SHRINK}
      />
      <span
        aria-hidden="true"
        className={classNames(
          PILL,
          'transition-fast-effects group-hover:bg-current/8 group-focus-visible:bg-current/10 group-active:bg-current/10',
          'group-focus-visible:outline-3 group-focus-visible:outline-solid group-focus-visible:outline-secondary group-focus-visible:outline-offset-2'
        )}
      />
      <span className="relative flex-center w-14 h-8 lg:w-auto lg:h-auto">
        {icon}
      </span>
      <span
        className={classNames(
          'relative whitespace-nowrap font-plain text-label-medium lg:text-label-large',
          isCurrentRoute
            ? 'text-primary lg:text-on-primary-container'
            : 'text-on-surface-variant'
        )}
      >
        {text}
      </span>
    </Link>
  );
}
