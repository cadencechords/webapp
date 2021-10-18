import ChordOption from "./ChordOption";
import FontSizesListBox from "./FontSizesListBox";
import FontsListBox from "./FontsListBox";

export default function EditorOptionsBar({ formatOptions, onFormatChange }) {
	return (
		<div className="flex items-center">
			<div className="px-3 border-r border-gray-300 w-32 relative">
				<FontsListBox
					selectedFont={formatOptions.font}
					onChange={(newValue) => onFormatChange("font", newValue)}
				/>
			</div>

			<div className="px-3 relative w-24 border-r border-gray-300">
				<FontSizesListBox
					selectedFontSize={formatOptions.font_size}
					onChange={(newValue) => onFormatChange("font_size", newValue)}
				/>
			</div>
			<div className="px-3 w-32">
				<ChordOption
					optionName="Bold chords"
					on={formatOptions.bold_chords}
					onChange={(newValue) => onFormatChange("bold_chords", newValue)}
				/>
			</div>
			<div className="px-3 w-32 border-r border-gray-300">
				<ChordOption
					optionName="Italic chords"
					on={formatOptions.italic_chords}
					onChange={(newValue) => onFormatChange("italic_chords", newValue)}
				/>
			</div>
		</div>
	);
}
