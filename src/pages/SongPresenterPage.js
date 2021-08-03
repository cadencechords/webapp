import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSongBeingPresented, adjustSongBeingPresented } from "../store/presenterSlice";
import { toHtml } from "../utils/SongUtils";
import SongPresenterMobileTopNav from "../components/SongPresenterMobileTopNav";
import SongAdjustmentsDrawer from "../components/SongAdjustmentsDrawer";
import Metronome from "../components/Metronome";
import Button from "../components/Button";
import ArrowsExpandIcon from "@heroicons/react/outline/ArrowsExpandIcon";
import { Textfit } from "react-textfit";

export default function SongPresenterPage() {
	const song = useSelector(selectSongBeingPresented);
	const dispatch = useDispatch();

	const [showOptionsDrawer, setShowOptionsDrawer] = useState(false);
	const [autosizing, setAutosizing] = useState(false);

	let formatStyles = { fontFamily: song.format.font, fontSize: song.format.font_size };

	const handleAdjustmentMade = (adjustmentField, adjustmentValue) => {
		dispatch(adjustSongBeingPresented({ [adjustmentField]: adjustmentValue }));
	};

	const handleToggleAutosize = () => {
		setAutosizing((autosizing) => !autosizing);
	};

	return (
		<>
			<SongPresenterMobileTopNav
				song={song}
				onShowOptionsDrawer={() => setShowOptionsDrawer(true)}
			/>

			<div className="mx-auto max-w-2xl p-3" style={formatStyles}>
				{autosizing ? (
					<Textfit mode="single">
						<div>
							{toHtml(
								song.content,
								{
									boldChords: song.format.bold_chords,
									italicChords: song.format.italic_chords,
									showChordsDisabled: song.showChordsDisabled,
								},
								false
							)}
						</div>
					</Textfit>
				) : (
					toHtml(song.content, {
						boldChords: song.format.bold_chords,
						italicChords: song.format.italic_chords,
						showChordsDisabled: song.showChordsDisabled,
					})
				)}
			</div>

			<Button
				variant="open"
				className="fixed bottom-16 right-6"
				onClick={handleToggleAutosize}
				color={autosizing ? "blue" : "gray"}
			>
				<ArrowsExpandIcon className="h-5 w-5" />
			</Button>
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
