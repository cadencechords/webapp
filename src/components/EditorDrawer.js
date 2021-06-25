import Drawer from "./Drawer";
import FontsListBox from "./FontsListBox";
import FontSizesListBox from "./FontSizesListBox";
import Toggle from "./Toggle";

export default function EditorDrawer({ open, onClose, formatOptions, onFormatChange }) {
	return (
		<Drawer open={open} onClose={onClose}>
			<section>
				<h2 className="border-b border-t p-3 font-semibold bg-gray-50">Lyric Options</h2>
				<div className="px-3 py-6">
					<div className="mb-3">
						<div className="mb-1">Font</div>
						<FontsListBox
							selectedFont={formatOptions.font}
							onChange={(newFont) => onFormatChange("font", newFont)}
						/>
					</div>
					<div className="mb-1">Size</div>
					<FontSizesListBox
						selectedFontSize={formatOptions.fontSize}
						onChange={(newFontSize) => onFormatChange("fontSize", newFontSize)}
					/>
				</div>
			</section>

			<section>
				<h2 className="border-b border-t p-3 font-semibold bg-gray-50">Chord Options</h2>
				<div className="px-3 py-6">
					<div className="mb-3">
						<Toggle
							label="Bold"
							spacing="between"
							enabled={formatOptions.boldChords}
							onChange={(newEnabledValue) => onFormatChange("boldChords", newEnabledValue)}
						/>
					</div>
					<Toggle
						label="Italic"
						spacing="between"
						enabled={formatOptions.italicChords}
						onChange={(newEnabledValue) => onFormatChange("italicChords", newEnabledValue)}
					/>
				</div>
			</section>
		</Drawer>
	);
}
