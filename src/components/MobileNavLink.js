import { Link, useRouteMatch } from "react-router-dom";
import PropTypes from "prop-types";

export default function MobileNavLink({ text, to, icon }) {
	let isCurrentRoute = useRouteMatch({
		path: to,
	});

	return (
		<Link
			to={to}
			className={`flex flex-col justify-center items-center rounded font-semibold transition-all ${
				isCurrentRoute ? "text-blue-700 " : "text-gray-500 "
			}`}
		>
			<span>{icon}</span> <span className="text-sm">{text}</span>
		</Link>
	);
}

MobileNavLink.propTypes = {
	to: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
};
