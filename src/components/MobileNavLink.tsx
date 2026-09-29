import classNames from 'classnames';
import { Link, useRouteMatch } from 'react-router-dom';
import type { ReactNode } from 'react';
import { GROW, SHRINK } from './NavigationRailItem';

type MobileNavLinkProps = {
  text?: string;
  /** A route renders a link; without one, a button that calls onClick. */
  to?: string;
  icon?: ReactNode;
  onClick?: () => void;
};

// An M3 navigation bar item, like the collapsed rail's: the icon in a 56×32
// pill that fills with primary-container (growing on the fast spring) while
// its route is current, the label under it.
export default function MobileNavLink({
  text,
  to,
  icon,
  onClick,
}: MobileNavLinkProps) {
  const isCurrentRoute = !!useRouteMatch({ path: to }) && !!to;

  const content = (
    <>
      <span className="relative flex-center w-14 h-8">
        <span
          aria-hidden="true"
          className={classNames(
            'absolute inset-0 rounded-full bg-primary-container origin-center',
            isCurrentRoute ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
          )}
          style={isCurrentRoute ? GROW : SHRINK}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full transition-fast-effects group-hover:bg-current/8 group-focus-visible:bg-current/10 group-active:bg-current/10 group-focus-visible:outline-3 group-focus-visible:outline-solid group-focus-visible:outline-secondary group-focus-visible:outline-offset-2"
        />
        <span className="relative flex-center">{icon}</span>
      </span>
      <span
        className={classNames(
          'font-plain text-label-medium',
          isCurrentRoute ? 'text-primary' : 'text-on-surface-variant'
        )}
      >
        {text}
      </span>
    </>
  );

  const classes = classNames(
    'group flex flex-col items-center flex-1 gap-1 py-1.5 outline-none',
    isCurrentRoute ? 'text-on-primary-container' : 'text-on-surface-variant'
  );

  if (to) {
    return (
      <Link
        to={to}
        aria-current={isCurrentRoute ? 'page' : undefined}
        className={classes}
      >
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
