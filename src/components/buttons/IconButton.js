import PropTypes from "prop-types";

export default function IconButton({ children, color, onClick }) {
	return (
		<button
			className={`focus:outline-none outline-none border-0 rounded-full bg-${color}-600 hover:bg-${color}-800 transition-all p-2 shadow-sm`}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

IconButton.propTypes = {
	onClick: PropTypes.func.isRequired,
};
