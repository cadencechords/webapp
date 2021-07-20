import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSongBeingPresented, adjustSongBeingPresented } from "../store/presenterSlice";
import { toHtml } from "../utils/SongUtils";
import SongPresenterMobileTopNav from "../components/SongPresenterMobileTopNav";
import SongAdjustmentsDrawer from "../components/SongAdjustmentsDrawer";
import Metronome from "../components/Metronome";

export default function SongPresenterPage() {
	const song = useSelector(selectSongBeingPresented);
	const dispatch = useDispatch();

	const [showOptionsDrawer, setShowOptionsDrawer] = useState(false);

	let formatStyles = { fontFamily: song.font, fontSize: song.font_size };

	const handleAdjustmentMade = (adjustmentField, adjustmentValue) => {
		dispatch(adjustSongBeingPresented({ [adjustmentField]: adjustmentValue }));
	};

	return (
		<>
			<SongPresenterMobileTopNav
				song={song}
				onShowOptionsDrawer={() => setShowOptionsDrawer(true)}
			/>

			<div className="mx-auto max-w-2xl p-3 whitespace-pre-wrap" style={formatStyles}>
				{toHtml(song.content, {
					boldChords: song.bold_chords,
					italicChords: song.italic_chords,
					showChordsDisabled: song.showChordsDisabled,
				})}
			</div>
			<SongAdjustmentsDrawer
				open={showOptionsDrawer}
				onClose={() => setShowOptionsDrawer(false)}
				song={song}
				onAdjustmentMade={handleAdjustmentMade}
			/>

			<Metronome
				bpm={song.bpm}
				onBpmChange={(newBpm) => dispatch(adjustSongBeingPresented({ bpm: newBpm }))}
			/>
		</>
	);
}
