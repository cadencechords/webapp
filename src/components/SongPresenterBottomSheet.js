import BottomSheet from "./BottomSheet";
import SongPresenterCapoSheet from "./SongPresenterCapoSheet";
import SongPresenterTransposeSheet from "./SongPresenterTransposeSheet";

export default function SongPresenterBottomSheet({ open, onClose, sheet, song, onSongChange }) {
	function getSheetContent() {
		if (sheet === "capo") {
			return (
				<SongPresenterCapoSheet song={song} onCapoChange={(capo) => onSongChange("capo", capo)} />
			);
		} else if (sheet === "transpose") {
			return <SongPresenterTransposeSheet song={song} onSongChange={onSongChange} />;
		}
	}

	return (
		<BottomSheet open={open} onClose={onClose} className="p-2">
			{getSheetContent()}
		</BottomSheet>
	);
}
