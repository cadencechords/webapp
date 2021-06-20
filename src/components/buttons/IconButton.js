import PropTypes from "prop-types";
import BACKGROUND_COLORS from "../Button";

export default function IconButton({ children, color, onClick }) {
	return (
		<button
			className={`focus:outline-none outline-none border-0 rounded-full ${BACKGROUND_COLORS[color]} transition-all p-2 shadow-sm`}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

IconButton.propTypes = {
	onClick: PropTypes.func.isRequired,
};
