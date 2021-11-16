import Drawer from "./Drawer";
import SongAdjustmentsDrawerAutoscrollSheet from "./SongAdjustmentsDrawerAutoscrollSheet";
import SongAdjustmentsDrawerMainSheet from "./SongAdjustmentsDrawerMainSheet";
import { useState } from "react";

export default function SongAdjustmentsDrawer({
	open,
	onClose,
	song,
	onFormatChange,
	onSongChange,
	onAddNote,
	autoScrolling,
	onToggleAutoScrolling,
	onShowSheet,
}) {
	const [sheetToShow, setSheetToShow] = useState("main");

	function getSheet() {
		switch (sheetToShow) {
			case "main":
				return (
					<SongAdjustmentsDrawerMainSheet
						song={song}
						onFormatChange={onFormatChange}
						onSongChange={onSongChange}
						onAddNote={onAddNote}
						onShowAutoScrollSheet={() => setSheetToShow("autoscroll")}
						onShowBottomSheet={onShowSheet}
					/>
				);
			case "autoscroll":
				return (
					<SongAdjustmentsDrawerAutoscrollSheet
						song={song}
						onShowMainSheet={() => setSheetToShow("main")}
						onSongChange={onSongChange}
						autoScrolling={autoScrolling}
						onToggleAutoScrolling={onToggleAutoScrolling}
					/>
				);
			default:
				return (
					<SongAdjustmentsDrawerMainSheet
						song={song}
						onFormatChange={onFormatChange}
						onSongChange={onSongChange}
						onAddNote={onAddNote}
						onShowAutoScrollSheet={() => setSheetToShow("autoscroll")}
					/>
				);
		}
	}
	return (
		<>
			<Drawer open={open} onClose={onClose}>
				{getSheet()}
			</Drawer>
		</>
	);
}
