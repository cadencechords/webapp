import CheckIcon from "@heroicons/react/solid/CheckIcon";
import PropTypes from "prop-types";

export default function Checkbox({ color, checked, onChange }) {
	return (
		<>
			<input type="checkbox" className="hidden" readOnly checked={checked} />
			<button
				className={`w-5 h-5 ${RING_COLORS[color]}
				shadow-sm focus:outline-none focus:ring-2 outline-none rounded-md cursor-pointer flex items-center justify-center
				${checked ? BACKGROUND_COLORS[color] : " border border-gray-300 "}`}
				onClick={() => onChange(!checked)}
			>
				<CheckIcon className="text-white font-semibold h-4 w-4" />
			</button>
		</>
	);
}

Checkbox.propTypes = {
	onChange: PropTypes.func.isRequired,
	color: PropTypes.string,
};

Checkbox.defaultProps = {
	color: "blue",
};

const RING_COLORS = {
	red: "ring-red-300",
	blue: "ring-blue-300",
	yellow: "ring-yellow-300",
	green: "ring-green-300",
	purple: "ring-purple-300",
	indigo: "ring-indigo-300",
	pink: "ring-pink-300",
	gray: "ring-gray-300",
	black: "ring-black",
	white: "bg-white",
};

const BACKGROUND_COLORS = {
	red: "bg-red-600",
	blue: "bg-blue-600",
	yellow: "bg-yellow-600",
	green: "bg-green-600",
	purple: "bg-purple-600",
	indigo: "bg-indigo-600",
	pink: "bg-pink-600",
	gray: "bg-gray-600",
	black: "bg-black",
	white: "bg-white",
};
