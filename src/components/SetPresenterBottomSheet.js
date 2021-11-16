import BottomSheet from "./BottomSheet";
import CapoSheet from "./CapoSheet";
import TransposeSheet from "./TransposeSheet";

export default function SetPresenterBottomSheet({ song, sheet, open, onClose, onSongUpdate }) {
	function getSheetContent() {
		if (sheet === "capo") {
			return <CapoSheet song={song} onCapoChange={(capo) => onSongUpdate("capo", capo)} />;
		} else if (sheet === "transpose") {
			return <TransposeSheet song={song} onSongChange={onSongUpdate} />;
		}
	}
	return (
		<BottomSheet open={open} onClose={onClose} className="p-2">
			{getSheetContent()}
		</BottomSheet>
	);
}
