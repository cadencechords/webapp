import CogIcon from "@heroicons/react/outline/CogIcon";
import { Draggable } from "react-beautiful-dnd";
import NoteDialog from "../dialogs/NoteDialog";
import { useState } from "react";

export default function Note({ note, inde, onUpdate, onDelete, isDragDisabled }) {
	const [showDialog, setShowDialog] = useState(false);
	return (
		<Draggable draggableId={`${note.id}`} index={inde} isDragDisabled={isDragDisabled}>
			{(provided) => (
				<>
					<div
						{...provided.draggableProps}
						ref={provided.innerRef}
						className="hidden md:flex shadow-md"
					>
						<textarea
							className={`w-full p-2 resize-none h-full outline-none focus:outline-none text-base md:text-sm ${
								NOTE_COLORS[note.color].main
							}`}
							value={note.content || ""}
							onChange={(e) => onUpdate(note, { content: e.target.value })}
							rows={3}
							placeholder="Type here"
						></textarea>
						<div className={`w-9 ${NOTE_COLORS[note.color].side}`}>
							<button
								className="outline-none focus:outline-none w-full py-1 flex-center"
								onClick={() => setShowDialog(true)}
							>
								<CogIcon className={`w-5 h-5 ${NOTE_COLORS[note.color].icon}`} />
							</button>

							<div {...provided.dragHandleProps} className="h-full w-full"></div>
						</div>
					</div>
					{/* <div
						className="shadow-md md:hidden flex w-16 h-10 bg-yellow-200"
						ref={provided.innerRef}
						{...provided.draggableProps}
					>
						<div className="w-1/2 h-full bg-red-100" {...provided.dragHandleProps}></div>
						<div className="w-1/2 h-full bg-blue-100"></div>
					</div> */}
					<NoteDialog
						open={showDialog}
						onCloseDialog={() => setShowDialog(false)}
						note={note}
						onUpdate={(updates) => onUpdate(note, updates)}
						onDelete={() => onDelete(note.id)}
					/>
				</>
			)}
		</Draggable>
	);
}

const NOTE_COLORS = {
	blue: { main: "bg-blue-200", side: "bg-blue-300", icon: "text-blue-900" },
	green: { main: "bg-green-200", side: "bg-green-300", icon: "text-green-900" },
	yellow: { main: "bg-yellow-200", side: "bg-yellow-300", icon: "text-yellow-900" },
	pink: { main: "bg-pink-200", side: "bg-pink-300", icon: "text-pink-900" },
};
