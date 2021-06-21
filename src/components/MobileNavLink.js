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
				className={`flex flex-col flex-grow justify-center items-center py-2 rounded font-semibold transition-all ${
					isCurrentRoute ? "text-blue-700 " : "text-gray-500 "
				} hover:text-gray-700`}
			>
				<span>{icon}</span> <span className="text-sm">{text}</span>
			</Link>
		);
	} else {
		return (
			<button
				onClick={onClick}
				className="focus:outline-none outline-none py-2 flex flex-grow flex-col justify-center items-center rounded font-semibold transition-all text-gray-500"
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
