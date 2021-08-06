import { Switch } from "@headlessui/react";
import { BACKGROUND_COLORS } from "./Button";

export default function Toggle({ enabled, onChange, label, color, spacing, disabled }) {
	return (
		<Switch.Group>
			<div className={`flex items-center ${SPACING[spacing]}`}>
				<Switch.Label className="mr-4">{label}</Switch.Label>
				<Switch
					checked={enabled}
					onChange={onChange}
					className={`${
						enabled ? BACKGROUND_COLORS[color] : "bg-gray-200"
					} relative inline-flex items-center md:h-6 h-7 rounded-full md:w-11 w-12 transition-colors focus:outline-none `}
				>
					<span
						className={`${
							enabled ? "translate-x-6" : "translate-x-1"
						} inline-block md:w-4 md:h-4 h-5 w-5 transform bg-white rounded-full transition-transform`}
					/>
				</Switch>
			</div>
		</Switch.Group>
	);
}

Toggle.defaultProps = {
	color: "blue",
	spacing: "none",
};

const SPACING = {
	between: "justify-between",
	none: "",
};
