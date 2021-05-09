import { useState } from "react";
import BinderColor from "./BinderColor";
import StyledListBox from "./StyledListBox";
import { COLORS } from "../utils/BinderUtils";

export default function ColorsList({ color, onChange }) {
	const [options] = useState(() => {
		let colorOptions = COLORS.map((color) => ({
			value: color,
			template: (
				<div className="flex items-center">
					<BinderColor color={color} />
					<div className="ml-6 flex items-center">{color}</div>
				</div>
			),
		}));
		return colorOptions;
	});

	let selectedColor = {
		value: color,
		template: (
			<div className="flex items-center">
				<BinderColor color={color} />
				<div className="ml-4 flex items-center">{color !== "none" && color}</div>
			</div>
		),
	};
	return <StyledListBox options={options} selectedOption={selectedColor} onChange={onChange} />;
}
