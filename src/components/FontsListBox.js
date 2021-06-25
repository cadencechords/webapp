import StyledListBox from "./StyledListBox";
import { FONTS } from "../utils/FormatUtils";
import { useState } from "react";

export default function FontsListBox({ selectedFont, onChange }) {
	const [fontOptions] = useState(() => {
		return FONTS.map((font) => ({
			value: font,
			template: (
				<div style={{ fontFamily: font }} className="text-sm">
					{font}
				</div>
			),
		}));
	});

	const selectedFontOption = {
		value: selectedFont,
		template: (
			<div className="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm">
				{selectedFont}
			</div>
		),
	};
	return (
		<StyledListBox
			options={fontOptions}
			selectedOption={selectedFontOption}
			onChange={onChange}
			background="white"
		></StyledListBox>
	);
}
