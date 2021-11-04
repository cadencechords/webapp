import { countLines, html } from "../utils/SongUtils";
import {
	selectSongBeingEdited,
	updateSongBeingEdited,
	updateSongContent,
} from "../store/editorSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import Button from "../components/Button";
import Editor from "../components/Editor";
import EditorDrawer from "../components/EditorDrawer";
import EditorMobileTopNav from "../components/EditorMobileTopNav";
import EditorOptionsBar from "../components/EditorOptionsBar";
import EyeIcon from "@heroicons/react/outline/EyeIcon";
import FormatApi from "../api/FormatApi";
import NotesApi from "../api/notesApi";
import NotesDragDropContext from "../components/NotesDragDropContext";
import PageTitle from "../components/PageTitle";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import SongApi from "../api/SongApi";
import { isEmpty } from "../utils/ObjectUtils";
import { max } from "../utils/numberUtils";
import { selectCurrentSubscription } from "../store/subscriptionSlice";
import { setSetlistBeingPresented } from "../store/presenterSlice";
import { useHistory } from "react-router";

export default function EditorWorkbenchPage() {
	const songBeingEdited = useSelector(selectSongBeingEdited);
	const [showEditorDrawer, setShowEditorDrawer] = useState(false);
	const [format, setFormat] = useState({});
	const [savingUpdates, setSavingUpdates] = useState(false);
	const [dirty, setDirty] = useState(false);
	const [showEditor, setShowEditor] = useState(true);

	const [changes, setChanges] = useState({ content: null, format: {} });

	const router = useHistory();

	const dispatch = useDispatch();
	const currentSubscription = useSelector(selectCurrentSubscription);

	if (!songBeingEdited || isEmpty(songBeingEdited)) {
		router.push("/");
	}

	useEffect(() => {
		let format = songBeingEdited.format;
		setFormat(format);
		document.title = songBeingEdited.name + " | Editor";
	}, [songBeingEdited]);

	const handleGoBack = () => {
		dispatch(setSetlistBeingPresented({}));
		router.goBack();
	};

	const handleFormatChange = (formatOption, value) => {
		setDirty(true);
		let formatOptionsCopy = { ...format };
		formatOptionsCopy[formatOption] = value;
		setFormat(formatOptionsCopy);
		setChanges((currentChanges) => ({
			...currentChanges,
			format: { ...currentChanges.format, [formatOption]: value },
		}));
	};

	const handleSaveChanges = async () => {
		try {
			if (changes.content) {
				setSavingUpdates(true);
				await SongApi.updateOneById(songBeingEdited.id, {
					content: changes.content,
				});
				dispatch(updateSongContent(changes.content));
			}

			if (!isEmpty(changes.format)) {
				setSavingUpdates(true);
				if (format.id) {
					await FormatApi.updateOneById(format.id, changes.format);
				} else {
					let newFormat = { ...changes.format };
					newFormat.song_id = songBeingEdited.id;
					await FormatApi.createOne(newFormat);
				}
			}
		} catch (error) {
			console.log(error);
		} finally {
			setSavingUpdates(false);
			setDirty(false);
			setChanges({ content: null, format: {} });
		}
	};

	const handleContentChange = (newContent) => {
		setChanges((currentChanges) => ({ ...currentChanges, content: newContent }));
		setDirty(true);
	};

	function handleUpdateNote(noteId, updates) {
		let updatedNotes = songBeingEdited.notes?.map((note) => {
			if (noteId === note.id) {
				return { ...note, ...updates };
			} else {
				return note;
			}
		});

		dispatch(updateSongBeingEdited({ notes: updatedNotes }));
	}

	function handleDeleteNote(noteId) {
		let updatedNotes = songBeingEdited.notes?.filter((note) => note.id !== noteId);
		dispatch(updateSongBeingEdited({ notes: updatedNotes }));
	}

	function handleAddTempNote(tempNote) {
		dispatch(updateSongBeingEdited({ notes: [...songBeingEdited.notes, tempNote] }));
	}

	function handleReplaceTempNote(tempId, realNote) {
		let index = songBeingEdited.notes.findIndex((note) => note.id === tempId);
		let notes = [...songBeingEdited.notes];
		if (index > -1) {
			notes = songBeingEdited.notes?.map((note) => (note.id === tempId ? realNote : note));
		} else {
			notes.push(realNote);
		}

		dispatch(updateSongBeingEdited({ notes }));
	}

	async function handleAddNote() {
		try {
			let { data } = await NotesApi.create(findNextAvailableLine(), songBeingEdited.id);
			setShowEditor(false);
			dispatch(updateSongBeingEdited({ notes: [...songBeingEdited.notes, data] }));
		} catch (error) {
			console.log(error);
		}
	}

	function findNextAvailableLine() {
		let highestLineNumber = 0;
		songBeingEdited.notes.forEach((note) => {
			if (note.line_number > highestLineNumber) highestLineNumber = note.line_number;
		});

		let lines = new Array(max(highestLineNumber, countLines(songBeingEdited.content))).fill(null);

		songBeingEdited.notes?.forEach((note) => (lines[note.line_number] = note));
		return lines.findIndex((line) => line === null);
	}

	return (
		<>
			<div className="sm:hidden">
				<EditorMobileTopNav
					song={songBeingEdited}
					onShowEditorDrawer={() => setShowEditorDrawer(true)}
					onGoBack={handleGoBack}
				/>
				<EditorDrawer
					formatOptions={format}
					open={showEditorDrawer}
					onClose={() => setShowEditorDrawer(false)}
					onFormatChange={handleFormatChange}
					onAddNote={handleAddNote}
				/>
				<div className="fixed w-full bottom-0 p-3 z-20">
					<Button full disabled={!dirty} onClick={handleSaveChanges} loading={savingUpdates}>
						Save Changes
					</Button>
				</div>
			</div>
			<div className="hidden sm:block">
				<div className="px-3 container mx-auto flex-between">
					<div className="flex items-center">
						<span className="mr-4">
							<Button variant="open" size="xs" onClick={handleGoBack}>
								<ArrowNarrowLeftIcon className="text-gray-600 h-6 w-6" />
							</Button>
						</span>
						<PageTitle title={songBeingEdited.name} />
					</div>
					<span>
						<Button disabled={!dirty} onClick={handleSaveChanges} loading={savingUpdates}>
							Save Changes
						</Button>
					</span>
				</div>
				<div className="bg-gray-50 py-3 px-5 border-t border-gray-200 border-b sticky top-0">
					<EditorOptionsBar
						formatOptions={format}
						onFormatChange={handleFormatChange}
						onAddNote={handleAddNote}
					/>
				</div>
			</div>
			<div className="hidden 2xl:grid grid-cols-2 ">
				<div className="col-span-2 2xl:col-span-1 container mx-auto px-5 mb-12 sm:mb-0 border-r">
					<Editor
						content={changes.content ? changes.content : songBeingEdited.content}
						formatOptions={format}
						onContentChange={handleContentChange}
					/>
				</div>
				<div className="px-5 my-3 hidden 2xl:block">
					<PageTitle title="Preview" className="mb-4" />
					<div className="flex">
						<div className="mr-2">
							{html({ content: changes.content || songBeingEdited.content, format: format })}
						</div>
						{currentSubscription.isPro && (
							<div className="w-64">
								<NotesDragDropContext
									song={songBeingEdited}
									onDeleteNote={handleDeleteNote}
									onUpdateNote={handleUpdateNote}
									onAddTempNote={handleAddTempNote}
									onReplaceTempNote={handleReplaceTempNote}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="2xl:hidden px-2 md:px-10 mb-28 ">
				{showEditor ? (
					<Editor
						content={changes.content ? changes.content : songBeingEdited.content}
						formatOptions={format}
						onContentChange={handleContentChange}
					/>
				) : (
					<div>
						<PageTitle title="Preview" className="my-4" />
						<div className="flex">
							<div>
								{html({ content: changes.content || songBeingEdited.content, format: format })}
							</div>
							{currentSubscription.isPro && (
								<div className="ml-10 w-64">
									<NotesDragDropContext
										song={songBeingEdited}
										onDeleteNote={handleDeleteNote}
										onUpdateNote={handleUpdateNote}
										onAddTempNote={handleAddTempNote}
										onReplaceTempNote={handleReplaceTempNote}
									/>
								</div>
							)}
						</div>
					</div>
				)}
				{showEditor ? (
					<Button
						onClick={() => setShowEditor(false)}
						variant="open"
						className="fixed bottom-16 right-4 sm:bottom-7 sm:right-7"
					>
						<EyeIcon className="h-6 w-6" />
					</Button>
				) : (
					<Button
						onClick={() => setShowEditor(true)}
						variant="open"
						className="fixed bottom-16 right-4 sm:bottom-7 sm:right-7"
					>
						<PencilIcon className="h-6 w-6" />
					</Button>
				)}
			</div>
		</>
	);
}
