import { adjustSongBeingPresented, selectSongBeingPresented } from "../store/presenterSlice";
import { toHtml, transpose } from "../utils/songUtils";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import ArrowsExpandIcon from "@heroicons/react/outline/ArrowsExpandIcon";
import Button from "../components/Button";
import Metronome from "../components/Metronome";
import SongAdjustmentsDrawer from "../components/SongAdjustmentsDrawer";
import SongPresenterMobileTopNav from "../components/SongPresenterMobileTopNav";
import { Textfit } from "react-textfit";

export default function SongPresenterPage() {
	const router = useHistory();
	const id = useParams().id;
	const song = useSelector(selectSongBeingPresented);
	const [content, setContent] = useState(() => {
		let content = song.content;

		if (song.transposed_key && song.original_key) {
			content = transpose(song);
		}

		return content;
	});
	const dispatch = useDispatch();

	const [showOptionsDrawer, setShowOptionsDrawer] = useState(false);
	const [autosizing, setAutosizing] = useState(false);
	const [transposing, setTransposing] = useState(true);

	useEffect(() => {
		if (song?.transposed_key && song?.original_key && transposing) {
			let transposedContent = transpose(song);

			setContent(transposedContent);
		} else {
			setContent(song.content);
		}
	}, [transposing, song]);

	let formatStyles = { fontFamily: song?.format?.font, fontSize: song?.format?.font_size };

	const handleAdjustmentMade = (adjustmentField, adjustmentValue) => {
		dispatch(adjustSongBeingPresented({ [adjustmentField]: adjustmentValue }));
	};

	const handleToggleAutosize = () => {
		setAutosizing((autosizing) => !autosizing);
	};

	if (song && song.format) {
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
									content,
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
						toHtml(content, {
							boldChords: song?.format?.bold_chords,
							italicChords: song?.format?.italic_chords,
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
					onToggleTranspose={() => setTransposing((currentlyTransposing) => !currentlyTransposing)}
					transposing={transposing}
				/>

				<Metronome
					bpm={song.bpm}
					onBpmChange={(newBpm) => dispatch(adjustSongBeingPresented({ bpm: newBpm }))}
				/>
			</>
		);
	} else {
		router.push(`/songs/${id}`);
		return null;
	}
}
