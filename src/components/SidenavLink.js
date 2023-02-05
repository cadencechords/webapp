import { Link, useRouteMatch } from 'react-router-dom';

import PropTypes from 'prop-types';

export default function SidenavLink({ text, to, icon, exact }) {
  let isCurrentRoute = useRouteMatch({
    path: to,
    exact: exact,
  });

  return (
    <div className="flex h-11">
      <Link
        to={to}
        className={`flex items-center rounded-lg lg:hover:bg-gray-100 lg:dark:hover:bg-dark-gray-700 pl-4 pr-2.5 lg:px-4 py-2 w-full my-0.5 lg:mx-2 ${
          isCurrentRoute
            ? ' text-blue-700 dark:text-dark-blue lg:bg-gray-100 lg:dark:bg-dark-gray-700'
            : 'text-gray-500 dark:text-dark-gray-200'
        }`}
      >
        <span
          className={
            isCurrentRoute
              ? 'text-blue-700 dark:text-dark-blue lg:mr-4'
              : 'text-gray-500 lg:mr-4'
          }
        >
          {icon}
        </span>{' '}
        <span className="hidden lg:inline">{text}</span>
      </Link>
      {isCurrentRoute && (
        <div className="w-1 my-1.5 rounded-xl lg:hidden bg-blue-600 dark:bg-dark-blue"></div>
      )}
    </div>
  );
}

SidenavLink.propTypes = {
  to: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

SidenavLink.defaultProps = {
  exact: false,
};
