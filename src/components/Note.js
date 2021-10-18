import { Draggable } from "react-beautiful-dnd";
import { useState } from "react";

export default function Note({ note, inde }) {
	return (
		<Draggable draggableId={`${note.id}`} index={inde}>
			{(provided) => (
				<div
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
					className="flex shadow-md"
				>
					<textarea
						className="w-full p-2 resize-none bg-yellow-200 h-full outline-none focus:outline-none"
						value={note.content || ""}
					></textarea>
					<div className="w-6 bg-yellow-300"></div>
				</div>
			)}
		</Draggable>
	);
}
