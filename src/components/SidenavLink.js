import { Link, useRouteMatch } from "react-router-dom";

import PropTypes from "prop-types";

export default function SidenavLink({ text, to, icon, exact }) {
	let isCurrentRoute = useRouteMatch({
		path: to,
		exact: exact,
	});

	return (
		<div className="flex">
			<Link
				to={to}
				className={`flex items-center rounded pl-4 pr-2.5 lg:px-4 py-2 w-full my-0.5 font-medium ${
					isCurrentRoute ? " text-blue-700 rounded" : "text-gray-500"
				}`}
			>
				<span className="lg:mr-3">{icon}</span> <span className="hidden lg:inline">{text}</span>
			</Link>
			{isCurrentRoute && <div className="w-1 my-1.5 rounded-lg bg-blue-600"></div>}
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
