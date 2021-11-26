import { Link, useRouteMatch } from "react-router-dom";

import PropTypes from "prop-types";

export default function MobileNavLink({ text, to, icon, onClick }) {
	let isCurrentRoute = useRouteMatch({
		path: to,
	});
	if (to) {
		return (
			<Link
				to={to}
				className={
					`flex-center flex-col flex-grow py-2 font-semibold transition-all ` +
					`${
						isCurrentRoute
							? " text-blue-700 dark:text-dark-blue "
							: "hover:text-gray-700 text-gray-500 dark:text-dark-gray-200"
					} `
				}
			>
				<span>{icon}</span> <span className="text-sm">{text}</span>
			</Link>
		);
	} else {
		return (
			<button
				onClick={onClick}
				className="focus:outline-none outline-none py-2 flex-center flex-grow flex-col rounded font-semibold transition-all hover:text-gray-700 text-gray-500 dark:text-dark-gray-200"
			>
				<span>{icon}</span>
				<span className="text-sm">{text}</span>
			</button>
		);
	}
}

MobileNavLink.propTypes = {
	text: PropTypes.string,
};
