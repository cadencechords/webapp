import Button from "./Button";
import Drawer from "./Drawer";
import FontSizesListBox from "./FontSizesListBox";
import FontsListBox from "./FontsListBox";
import PencilAltIcon from "@heroicons/react/outline/PencilAltIcon";
import Toggle from "./Toggle";
import { selectCurrentSubscription } from "../store/subscriptionSlice";
import { useSelector } from "react-redux";

export default function EditorDrawer({ open, onClose, formatOptions, onFormatChange, onAddNote }) {
	const currentSubscription = useSelector(selectCurrentSubscription);

	return (
		<Drawer open={open} onClose={onClose}>
			<section>
				<h2 className="border-b border-t dark:border-dark-gray-400 p-3 font-semibold bg-gray-50 dark:bg-dark-gray-600">
					Lyric Options
				</h2>
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
						selectedFontSize={formatOptions.font_size}
						onChange={(newFontSize) => onFormatChange("font_size", newFontSize)}
					/>
				</div>
			</section>

			<section>
				<h2 className="border-b border-t dark:border-dark-gray-400 p-3 font-semibold bg-gray-50 dark:bg-dark-gray-600">
					Chord Options
				</h2>
				<div className="px-3 py-6">
					<div className="mb-3">
						<Toggle
							label="Bold"
							spacing="between"
							enabled={formatOptions.bold_chords}
							onChange={(newEnabledValue) => onFormatChange("bold_chords", newEnabledValue)}
						/>
					</div>
					<Toggle
						label="Italic"
						spacing="between"
						enabled={formatOptions.italic_chords}
						onChange={(newEnabledValue) => onFormatChange("italic_chords", newEnabledValue)}
					/>
				</div>
			</section>
			{currentSubscription.isPro && (
				<section>
					<h2 className="border-b border-t dark:border-dark-gray-400 p-3 font-semibold bg-gray-50 dark:bg-dark-gray-600">
						More Options
					</h2>
					<div className="px-3 py-6">
						<Button
							full
							variant="outlined"
							color="black"
							className="flex-center"
							onClick={onAddNote}
						>
							<PencilAltIcon className="h-5 w-5 text-blue-600 mr-2" />
							Add note
						</Button>
					</div>
				</section>
			)}
		</Drawer>
	);
}
