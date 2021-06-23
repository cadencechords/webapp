import { Switch } from "@headlessui/react";
import { BACKGROUND_COLORS } from "./Button";

export default function Toggle({ enabled, onChange, label, color, spacing }) {
	return (
		<Switch.Group>
			<div className={`flex items-center ${SPACING[spacing]}`}>
				<Switch.Label className="mr-4">{label}</Switch.Label>
				<Switch
					checked={enabled}
					onChange={onChange}
					className={`${
						enabled ? BACKGROUND_COLORS[color] : "bg-gray-200"
					} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none `}
				>
					<span
						className={`${
							enabled ? "translate-x-6" : "translate-x-1"
						} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
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
