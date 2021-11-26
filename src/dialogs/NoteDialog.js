import Button from "../components/Button";
import Label from "../components/Label";
import NoteColorOption from "../components/NoteColorOption";
import StyledDialog from "../components/StyledDialog";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import { useEffect } from "react";
import { useState } from "react";

export default function NoteDialog({ note, open, onCloseDialog, onUpdate, onDelete }) {
	const [updates, setUpdates] = useState({});

	useEffect(() => {
		setUpdates({ content: note.content });
	}, [note]);

	function handleUpdate(field, value) {
		setUpdates((currentUpdates) => ({ ...currentUpdates, [field]: value }));
	}

	function handleConfirmUpdates() {
		onUpdate(updates);
		setUpdates({});
		onCloseDialog();
	}

	function isSelectedColor(color) {
		if (updates.color) {
			return updates.color === color;
		} else {
			return note.color === color;
		}
	}

	function handleDelete() {
		setUpdates({});
		onDelete();
		onCloseDialog();
	}

	return (
		<StyledDialog open={open} onCloseDialog={onCloseDialog} borderedTop={false} title="Edit note">
			<Label>Note</Label>
			<textarea
				placeholder="Type here"
				onChange={(e) => handleUpdate("content", e.target.value)}
				value={updates.content || ""}
				className="text-base p-2 w-full border border-dark-gray-600 rounded-md resize-none outline-none focus:outline-none focus:border-blue-400 dark:focus:border-dark-blue transition-colors mb-4 dark:bg-dark-gray-900 "
			></textarea>
			<Label>Note color</Label>
			<NoteColorOption
				color={NOTE_COLOR_OPTIONS.blue}
				selected={isSelectedColor("blue")}
				onClick={() => handleUpdate("color", "blue")}
			/>
			<NoteColorOption
				color={NOTE_COLOR_OPTIONS.pink}
				selected={isSelectedColor("pink")}
				onClick={() => handleUpdate("color", "pink")}
			/>
			<NoteColorOption
				color={NOTE_COLOR_OPTIONS.green}
				selected={isSelectedColor("green")}
				onClick={() => handleUpdate("color", "green")}
			/>
			<NoteColorOption
				color={NOTE_COLOR_OPTIONS.yellow}
				selected={isSelectedColor("yellow")}
				onClick={() => handleUpdate("color", "yellow")}
			/>
			<div className="flex-between items-center gap-4 mt-8">
				<Button full onClick={handleConfirmUpdates}>
					Confirm
				</Button>
				<Button variant="open" color="gray" onClick={handleDelete}>
					<TrashIcon className="w-5 h-5" />
				</Button>
			</div>
		</StyledDialog>
	);
}

const NOTE_COLOR_OPTIONS = {
	blue: "bg-blue-200 dark:bg-blue-300",
	pink: "bg-pink-200 dark:bg-pink-300",
	green: "bg-green-200 bg-green-300",
	yellow: "bg-yellow-200 bg-yellow-300",
};
