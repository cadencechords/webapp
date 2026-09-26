import { Link, useRouteMatch } from 'react-router-dom';

import type { ReactNode } from 'react';

type MobileNavLinkProps = {
  text?: string;
  /** A route renders a link; without one, a button that calls onClick. */
  to?: string;
  icon?: ReactNode;
  onClick?: () => void;
};

export default function MobileNavLink({
  text,
  to,
  icon,
  onClick,
}: MobileNavLinkProps) {
  const isCurrentRoute = useRouteMatch({
    path: to,
  });
  if (to) {
    return (
      <Link
        to={to}
        className={
          `flex-center flex-col flex-1 font-semibold transition-all ` +
          `${
            isCurrentRoute
              ? ' text-blue-700 dark:text-dark-blue '
              : 'hover:text-gray-700 text-gray-500 dark:text-dark-gray-200'
          } `
        }
      >
        <span>{icon}</span> <span className="text-xs font-normal">{text}</span>
      </Link>
    );
  } else {
    return (
      <button
        onClick={onClick}
        className="flex-col flex-1 py-1 font-semibold text-gray-500 transition-all rounded-sm outline-hidden focus:outline-hidden flex-center hover:text-gray-700 dark:text-dark-gray-200"
      >
        <span>{icon}</span>
        <span className="text-xs font-normal">{text}</span>
      </button>
    );
  }
}
