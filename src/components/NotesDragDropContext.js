import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import Note from "./Note";
import _ from "lodash";
import { countLines } from "../utils/SongUtils";
import { max } from "../utils/numberUtils";
import notesApi from "../api/notesApi";
import { reportError } from "../utils/error";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function NotesDragDropContext({
	song,
	onAddTempNote,
	onReplaceTempNote,
	onUpdateNote,
	onDeleteNote,
	rearrangable,
}) {
	const [lineCount] = useState(() => {
		let highestLineNumber = 0;
		song.notes?.forEach((note) => {
			if (note.line_number > highestLineNumber) highestLineNumber = note.line_number;
		});

		return max(highestLineNumber, countLines(song.content));
	});

	const [lines, setLines] = useState(new Array(lineCount).fill(null));

	useEffect(() => {
		let newLines = new Array(lineCount).fill(null);
		song.notes?.forEach((note) => (newLines[note.line_number] = note));
		setLines(newLines);
	}, [song, lineCount]);

	function handleDragEnd({ source, destination }) {
		if (!destination) return;

		let noteBeingUpdated = lines[source.index];
		handleUpdateNote(noteBeingUpdated, { line_number: destination.index });
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
			reportError(error);
		}
	}

	function reorder(list, startIndex, endIndex) {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	}

	function getNotesColumnStyles(snapshot) {
		return snapshot.isDraggingOver
			? "bg-gray-100 dark:bg-dark-gray-700"
			: "bg-white dark:bg-dark-gray-900";
	}

	function handleUpdateNote(note, updates) {
		setLines((currentLines) => {
			let updatedLines = currentLines.map((line, index) =>
				index === note.line_number ? { ...note, ...updates } : line
			);
			return updatedLines;
		});
		onUpdateNote(note.id, updates);
		debounce(note.id, updates);
	}

	// eslint-disable-next-line
	const debounce = useCallback(
		_.debounce(
			(noteId, updates) => {
				try {
					notesApi.update(song.id, noteId, updates);
				} catch (error) {
					reportError(error);
				}
			},
			[1200]
		),
		[]
	);

	async function handleDelete(noteId) {
		onDeleteNote(noteId);
		try {
			await notesApi.delete(song.id, noteId);
		} catch (error) {
			reportError(error);
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
									isDragDisabled={!rearrangable}
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

NotesDragDropContext.defaultProps = {
	rearrangable: true,
};
