import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import Note from "./Note";
import _ from "lodash";
import { countLines } from "../utils/songUtils";
import notesApi from "../api/notesApi";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function NotesDragDropContext({
	song,
	onAddTempNote,
	onReplaceTempNote,
	onUpdateNote,
	onDeleteNote,
}) {
	const [lines, setLines] = useState(new Array(countLines(song.content)).fill(null));

	useEffect(() => {
		let newLines = new Array(countLines(song.content)).fill(null);
		song.notes?.forEach((note) => {
			if (note.line_number < newLines.length && newLines[note.line_number] != null) {
				newLines[note.line_number] = note;
			} else {
				// find the next available line number
			}
		});
		setLines(newLines);
	}, [song]);

	function handleDragEnd({ source, destination }) {
		if (!destination) return;

		let noteBeingUpdated = lines[source.index];
		handleUpdateNote(noteBeingUpdated.id, { line_number: destination.index });
		setLines((currentLines) => reorder(currentLines, source.index, destination.index));
	}

	async function handleAddNewNote(lineNumber) {
		const tempId = Math.random();
		const note = { id: tempId, content: "", color: "yellow", line_number: lineNumber };

		onAddTempNote(note);

		try {
			let { data } = await notesApi.create(lineNumber, song.id);
			onReplaceTempNote(tempId, data);
		} catch (error) {
			console.log(error);
		}
	}

	function reorder(list, startIndex, endIndex) {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	}

	function getNotesColumnStyles(snapshot) {
		return snapshot.isDraggingOver ? "bg-gray-100" : "bg-white";
	}

	function handleUpdateNote(noteId, updates) {
		onUpdateNote(noteId, updates);
		debounce(noteId, updates);
	}

	// eslint-disable-next-line
	const debounce = useCallback(
		_.debounce(
			(noteId, updates) => {
				try {
					notesApi.update(song.id, noteId, updates);
				} catch (error) {
					console.log(error);
				}
			},
			[800]
		),
		[]
	);

	function handleDelete(noteId) {
		onDeleteNote(noteId);
		try {
			notesApi.delete(song.id, noteId);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Droppable droppableId="droppable">
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={`md:px-1 transition-colors ${getNotesColumnStyles(snapshot)}`}
					>
						{lines.map((line, index) =>
							line ? (
								<Note
									note={line}
									inde={index}
									key={index}
									onUpdate={handleUpdateNote}
									onDelete={handleDelete}
								/>
							) : (
								<Draggable key={index} draggableId={`${index}`} index={index} isDragDisabled>
									{(provided) => (
										<div
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											ref={provided.innerRef}
											onDoubleClick={() => handleAddNewNote(index)}
										>
											<span
												style={{
													fontFamily: song.format.font,
													fontSize: `${song.format.font_size}px`,
												}}
												className="select-none"
											>
												&nbsp;
											</span>
										</div>
									)}
								</Draggable>
							)
						)}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}
