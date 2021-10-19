import { adjustSongBeingPresented, selectSongBeingPresented } from "../store/presenterSlice";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import ArrowsExpandIcon from "@heroicons/react/outline/ArrowsExpandIcon";
import Button from "../components/Button";
import Metronome from "../components/Metronome";
import SongAdjustmentsDrawer from "../components/SongAdjustmentsDrawer";
import SongPresenterMobileTopNav from "../components/SongPresenterMobileTopNav";
import { html } from "../utils/songUtils";
import { selectCurrentSubscription } from "../store/subscriptionSlice";
import { useState } from "react";

// import NotesDragDropContext from "../components/NotesDragDropContext";

export default function SongPresenterPage() {
	const router = useHistory();
	const id = useParams().id;
	const song = useSelector(selectSongBeingPresented);
	const dispatch = useDispatch();
	const currentSubscription = useSelector(selectCurrentSubscription);

	const [showOptionsDrawer, setShowOptionsDrawer] = useState(false);

	function handleFormatChange(field, value) {
		let updatedFormat = { ...song.format, [field]: value };
		dispatch(adjustSongBeingPresented({ format: updatedFormat }));
	}

	function handleSongChange(field, value) {
		dispatch(adjustSongBeingPresented({ [field]: value }));
	}

	function handleLineDoubleClick(line, index) {
		console.log(index, line);
	}

	// function handleAddTempNote(tempNote) {
	// 	dispatch(adjustSongBeingPresented({ notes: [...song.notes, tempNote] }));
	// }

	// function handleReplaceTempNote(tempId, realNote) {
	// 	let index = song.notes.findIndex((note) => note.id === tempId);
	// 	let notes = [...song.notes];
	// 	if (index > -1) {
	// 		notes = song.notes?.map((note) => (note.id === tempId ? realNote : note));
	// 	} else {
	// 		notes.push(realNote);
	// 	}

	// 	dispatch(adjustSongBeingPresented({ notes }));
	// }

	// function handleUpdateNote(noteId, updates) {
	// 	let notesCopy = [...song.notes];
	// 	notesCopy = notesCopy.map((note) => (note.id === noteId ? { ...note, ...updates } : note));

	// 	dispatch(adjustSongBeingPresented({ notes: notesCopy }));
	// }

	// function handleDeleteNote(noteIdToDelete) {
	// 	let filteredNotes = song.notes.filter((note) => note.id !== noteIdToDelete);
	// 	dispatch(adjustSongBeingPresented({ notes: filteredNotes }));
	// }

	if (song && song.format) {
		return (
			<>
				<SongPresenterMobileTopNav
					song={song}
					onShowOptionsDrawer={() => setShowOptionsDrawer(true)}
				/>

				<div className="mx-auto max-w-6xl p-3 flex items-start">
					<div className="">{html(song, handleLineDoubleClick)}</div>
					<div className="fixed md:relative right-0 flex md:ml-20 md:flex-grow">
						{currentSubscription?.isPro && (
							<div className="md:w-64">
								{/* <NotesDragDropContext
									song={song}
									onAddTempNote={handleAddTempNote}
									onReplaceTempNote={handleReplaceTempNote}
									onUpdateNote={handleUpdateNote}
									onDeleteNote={handleDeleteNote}
								/> */}
							</div>
						)}
					</div>
				</div>

				<Button
					variant="open"
					className="fixed bottom-16 right-6 md:mr-0"
					onClick={() => handleFormatChange("autosize", !song?.format?.autosize)}
					color={song?.format?.autosize ? "blue" : "gray"}
				>
					<ArrowsExpandIcon className="h-5 w-5" />
				</Button>
				<SongAdjustmentsDrawer
					open={showOptionsDrawer}
					onClose={() => setShowOptionsDrawer(false)}
					song={song}
					onFormatChange={handleFormatChange}
					onSongChange={handleSongChange}
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
