import classNames from 'classnames';
import type { CSSProperties, ReactNode } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

type NavigationRailItemProps = {
  text: string;
  to: string;
  /** Shown while the destination isn't the current route (outlined). */
  icon: ReactNode;
  /** Shown while it is (filled). */
  activeIcon: ReactNode;
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
const GROW: CSSProperties = {
  transition: `scale ${spring('fast-spatial')}, opacity ${spring('fast-effects')}`,
};
const SHRINK: CSSProperties = {
  transition: `scale ${spring('fast-effects')}, opacity ${spring('fast-effects')}`,
};

/** One destination of the M3E navigation rail. */
export default function NavigationRailItem({
  text,
  to,
  icon,
  activeIcon,
  exact = false,
}: NavigationRailItemProps) {
  const isCurrentRoute = !!useRouteMatch({ path: to, exact });

  return (
    <Link
      to={to}
      aria-current={isCurrentRoute ? 'page' : undefined}
      className={classNames(
        'group relative flex flex-col items-center gap-1 py-1 outline-none',
        'lg:flex-row lg:gap-3 lg:w-fit lg:h-14 lg:px-4 lg:py-0',
        isCurrentRoute
          ? 'text-on-secondary-container'
          : 'text-on-surface-variant'
      )}
    >
      <span
        aria-hidden="true"
        data-rail-indicator
        className={classNames(
          PILL,
          'bg-secondary-container origin-center lg:origin-left',
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
        {isCurrentRoute ? activeIcon : icon}
      </span>
      <span
        className={classNames(
          'relative whitespace-nowrap font-plain text-label-medium lg:text-label-large',
          isCurrentRoute
            ? 'text-secondary lg:text-on-secondary-container'
            : 'text-on-surface-variant'
        )}
      >
        {text}
      </span>
    </Link>
  );
}
