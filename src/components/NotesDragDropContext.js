import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Note from "./Note";
import { countLines } from "../utils/songUtils";
import { useState } from "react";

export default function NotesDragDropContext({ song, onLineHover }) {
	const [lines, setLines] = useState(new Array(countLines(song.content)).fill(null));

	function handleDragEnd({ source, destination }) {
		if (!destination) return;

		setLines((currentLines) => {
			let destinationIndex = parseInt(destination.droppableId);
			let sourceIndex = parseInt(source.droppableId);

			let copy = [...currentLines];

			if (!copy[destinationIndex]) {
				copy[destinationIndex] = copy[sourceIndex];
				copy[sourceIndex] = null;
			}

			return copy;
		});
		onLineHover(null);
	}

	function handleAddNewNote(lineNumber) {
		setLines((currentLines) => {
			let copy = [...currentLines];
			copy[lineNumber] = { content: "" };

			return copy;
		});
	}

	function handleDragUpdate({ destination }) {
		if (destination) {
			let lineHoveringOver = parseInt(destination.droppableId);
			onLineHover(lineHoveringOver);
		}
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd} onDragUpdate={handleDragUpdate}>
			{lines.map((line, index) => (
				<Droppable droppableId={`${index}`} key={index}>
					{(provided) => (
						<div ref={provided.innerRef} {...provided.droppableProps}>
							{line ? (
								<Note note={line} inde={index} />
							) : (
								<div
									onDoubleClick={() => handleAddNewNote(index)}
									style={{ fontFamily: song.format.font, fontSize: `${song.format.font_size}px` }}
								>
									&nbsp;
								</div>
							)}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			))}
		</DragDropContext>
	);
}
