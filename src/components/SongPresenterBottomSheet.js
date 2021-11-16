import BottomSheet from "./BottomSheet";
import CapoSheet from "./CapoSheet";
import MetronomeSheet from "./MetronomeSheet";
import TransposeSheet from "./TransposeSheet";

export default function SongPresenterBottomSheet({ open, onClose, sheet, song, onSongChange }) {
	function getSheetContent() {
		if (sheet === "capo") {
			return <CapoSheet song={song} onCapoChange={(capo) => onSongChange("capo", capo)} />;
		} else if (sheet === "transpose") {
			return <TransposeSheet song={song} onSongChange={onSongChange} />;
		} else if (sheet === "metronome") {
			return <MetronomeSheet song={song} onSongChange={onSongChange} />;
		}
	}

	return (
		<BottomSheet open={open} onClose={onClose} className="p-2">
			{getSheetContent()}
		</BottomSheet>
	);
}
