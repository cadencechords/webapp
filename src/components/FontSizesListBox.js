import { useState } from "react";
import StyledListBox from "./StyledListBox";
import { FONT_SIZES } from "../utils/FormatUtils";

export default function FontSizesListBox({ selectedFontSize, onChange }) {
	const [fontSizeOptions] = useState(() => {
		return FONT_SIZES.map((fontSize) => ({
			value: fontSize,
			template: <div className="text-sm">{fontSize}</div>,
		}));
	});

	const selectedFontSizeOption = {
		value: selectedFontSize,
		template: <div className="text-sm pr-2">{selectedFontSize}</div>,
	};
	return (
		<StyledListBox
			onChange={onChange}
			options={fontSizeOptions}
			selectedOption={selectedFontSizeOption}
			background="white"
		></StyledListBox>
	);
}
