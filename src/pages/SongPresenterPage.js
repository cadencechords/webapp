import { adjustSongBeingPresented, selectSongBeingPresented } from "../store/presenterSlice";
import { countLines, html } from "../utils/SongUtils";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useRef, useState } from "react";

import NotesDragDropContext from "../components/NotesDragDropContext";
import SongAdjustmentsDrawer from "../components/SongAdjustmentsDrawer";
import SongPresenterBottomSheet from "../components/SongPresenterBottomSheet";
import SongPresenterTopBar from "../components/SongPresenterTopBar";
import { max } from "../utils/numberUtils";
import notesApi from "../api/notesApi";
import { reportError } from "../utils/error";
import { selectCurrentSubscription } from "../store/subscriptionSlice";

export default function SongPresenterPage() {
	const router = useHistory();
	const id = useParams().id;
	const song = useSelector(selectSongBeingPresented);
	const dispatch = useDispatch();
	const currentSubscription = useSelector(selectCurrentSubscription);
	const pageRef = useRef();
	const [bottomSheet, setBottomSheet] = useState();
	const [showBottomSheet, setShowBottomSheet] = useState(false);

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

	function handleAddTempNote(tempNote) {
		dispatch(adjustSongBeingPresented({ notes: [...song.notes, tempNote] }));
	}

	function handleReplaceTempNote(tempId, realNote) {
		let index = song.notes.findIndex((note) => note.id === tempId);
		let notes = [...song.notes];
		if (index > -1) {
			notes = song.notes?.map((note) => (note.id === tempId ? realNote : note));
		} else {
			notes.push(realNote);
		}

		dispatch(adjustSongBeingPresented({ notes }));
	}

	function handleUpdateNote(noteId, updates) {
		let notesCopy = [...song.notes];
		notesCopy = notesCopy.map((note) => (note.id === noteId ? { ...note, ...updates } : note));

		dispatch(adjustSongBeingPresented({ notes: notesCopy }));
	}

	function handleDeleteNote(noteIdToDelete) {
		let filteredNotes = song.notes.filter((note) => note.id !== noteIdToDelete);
		dispatch(adjustSongBeingPresented({ notes: filteredNotes }));
	}

	async function handleAddNote() {
		try {
			let { data } = await notesApi.create(findNextAvailableLine(), song.id);
			dispatch(adjustSongBeingPresented({ notes: [...song.notes, data] }));
		} catch (error) {
			reportError(error);
		}
	}

	function findNextAvailableLine() {
		let highestLineNumber = 0;
		song.notes.forEach((note) => {
			if (note.line_number > highestLineNumber) highestLineNumber = note.line_number;
		});

		let lines = new Array(max(highestLineNumber, countLines(song.content))).fill(null);
		song.notes?.forEach((note) => (lines[note.line_number] = note));
		return lines.findIndex((line) => line === null);
	}

	function handleShowBottomSheet(sheet) {
		setShowBottomSheet(true);
		setShowOptionsDrawer(false);
		setBottomSheet(sheet);
	}

	if (song && song.format) {
		return (
			<div ref={pageRef} id="page">
				<SongPresenterTopBar
					song={song}
					onShowOptionsDrawer={() => setShowOptionsDrawer(true)}
					onShowBottomSheet={handleShowBottomSheet}
				/>

				<div className="mx-auto max-w-6xl p-3">
					<div className={`relative ${song?.format?.autosize ? "" : "inline-block"}`}>
						<div id="song" className={`mr-0 ${song?.notes?.length > 0 ? "md:mr-72" : ""}`}>
							{html(song, handleLineDoubleClick)}
						</div>

						{currentSubscription?.isPro && song.notes?.length > 0 && (
							<div className="hidden md:absolute top-0 right-0 md:flex md:w-64">
								<div className="md:w-64">
									<NotesDragDropContext
										song={song}
										onAddTempNote={handleAddTempNote}
										onReplaceTempNote={handleReplaceTempNote}
										onUpdateNote={handleUpdateNote}
										onDeleteNote={handleDeleteNote}
									/>
								</div>
							</div>
						)}
					</div>
				</div>

				<SongAdjustmentsDrawer
					open={showOptionsDrawer}
					onClose={() => setShowOptionsDrawer(false)}
					song={song}
					onFormatChange={handleFormatChange}
					onSongChange={handleSongChange}
					onAddNote={handleAddNote}
					onShowSheet={handleShowBottomSheet}
				/>

				<SongPresenterBottomSheet
					sheet={bottomSheet}
					open={showBottomSheet}
					onClose={() => setShowBottomSheet(false)}
					song={song}
					onSongChange={handleSongChange}
				/>
			</div>
		);
	} else {
		router.push(`/songs/${id}`);
		return null;
	}
}
