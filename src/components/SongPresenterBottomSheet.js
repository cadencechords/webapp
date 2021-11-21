import AutoscrollSheet from "./AutoscrollSheet";
import BottomSheet from "./BottomSheet";
import CapoSheet from "./CapoSheet";
import MetronomeSheet from "./MetronomeSheet";
import TransposeSheet from "./TransposeSheet";

export default function SongPresenterBottomSheet({ open, onClose, sheet, song, onSongChange }) {
	function isHidden(sheetInQuestion) {
		return sheet === sheetInQuestion ? "" : "hidden";
	}

	return (
		<BottomSheet open={open} onClose={onClose} className="py-2 px-3">
			<CapoSheet
				song={song}
				onCapoChange={(capo) => onSongChange("capo", capo)}
				className={isHidden("capo")}
			/>
			<TransposeSheet song={song} onSongChange={onSongChange} className={isHidden("transpose")} />
			<MetronomeSheet song={song} onSongChange={onSongChange} className={isHidden("metronome")} />
			<AutoscrollSheet song={song} onSongChange={onSongChange} className={isHidden("autoscroll")} />
		</BottomSheet>
	);
}
