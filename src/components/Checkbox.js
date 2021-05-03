import { useState } from "react";
import CheckIcon from "@heroicons/react/solid/CheckIcon";
import PropTypes from "prop-types";

export default function Checkbox({ color, checked, onChange }) {
	return (
		<>
			<input type="checkbox" className="hidden" readOnly checked={checked} />
			<button
				className={`w-5 h-5 ring-${color}-200 focus:outline-none focus:ring-2 outline-none rounded-md cursor-pointer flex items-center justify-center ${
					checked ? " bg-" + color + "-600" : " border border-gray-300 "
				}`}
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
