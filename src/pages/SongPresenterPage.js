import { adjustSongBeingPresented, selectSongBeingPresented } from "../store/presenterSlice";
import { countLines, html } from "../utils/SongUtils";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useRef, useState } from "react";

import ArrowsExpandIcon from "@heroicons/react/outline/ArrowsExpandIcon";
import Button from "../components/Button";
import Metronome from "../components/Metronome";
import NotesDragDropContext from "../components/NotesDragDropContext";
import PresenterKeyCapoDialog from "../dialogs/PresenterKeyCapoDialog";
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
	const [autoScrollInterval, setAutoScrollInterval] = useState();
	const [autoScrolling, setAutoScrolling] = useState(false);
	const [showKeysDialog, setShowKeysDialog] = useState(false);
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

	function scroll() {
		if (pageRef?.current) {
			if (isAtBottom(pageRef.current)) {
				clearInterval(autoScrollInterval);
				setAutoScrolling(false);
			} else {
				let currentScrollPosition = pageRef.current.scrollTop;
				console.log(song.scroll_speed);
				pageRef.current.scroll({
					top: currentScrollPosition + song.scroll_speed,
					left: 0,
					behavior: "smooth",
				});
			}
		}
	}

	function isAtBottom(element) {
		return Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) <= 13;
	}

	function handleToggleAutoScroll() {
		if (autoScrollInterval) {
			clearInterval(autoScrollInterval);
			setAutoScrollInterval(null);
			setAutoScrolling(false);
		} else {
			setAutoScrolling(true);
			setTimeout(() => {
				let interval = setInterval(() => {
					scroll();
				}, [100]);
				setAutoScrollInterval(interval);
			}, [5000]);
		}
	}

	// function handleScrollSpeedChange(newSpeed) {
	// 	handleSongChange("scroll_speed", newSpeed);
	// }

	function handleShowBottomSheet(sheet) {
		setShowBottomSheet(true);
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

				<div className="mx-auto max-w-6xl p-3 flex items-start">
					<div className="flex-grow" id="song">
						{html(song, handleLineDoubleClick)}
					</div>

					{currentSubscription?.isPro && song.notes?.length > 0 && (
						<div className="fixed md:relative right-0 flex md:ml-20 md:w-64">
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
					onAddNote={handleAddNote}
					autoScrolling={autoScrolling}
					onToggleAutoScrolling={handleToggleAutoScroll}
				/>
				<PresenterKeyCapoDialog
					open={showKeysDialog}
					onCloseDialog={() => setShowKeysDialog(false)}
					song={song}
					onSongChange={handleSongChange}
				/>

				<Metronome
					bpm={song.bpm}
					onBpmChange={(newBpm) => dispatch(adjustSongBeingPresented({ bpm: newBpm }))}
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
