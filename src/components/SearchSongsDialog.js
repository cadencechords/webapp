import StyledDialog from "./StyledDialog";
import OpenInput from "./inputs/OpenInput";
import Checkbox from "./Checkbox";
import { useState } from "react";
import StackedList from "./StackedList";
import OpenButton from "./buttons/OpenButton";

export default function SearchSongsDialog({ open, onCloseDialog }) {
	const [checked, setChecked] = useState(false);
	const songs = [
		{ id: 0, name: "How Great Thou Art" },
		{ id: 1, name: "Amazing Grace" },
	];

	const songListItems = songs.map((song) => (
		<div key={song.id} className="flex items-center">
			<Checkbox
				checked={checked}
				onChange={(value) => setChecked(value)}
				color="blue"
			/>
			<span className="ml-4">{song.name}</span>
		</div>
	));

	return (
		<StyledDialog open={open} onCloseDialog={onCloseDialog}>
			<div className="border-b pb-2 mb-7">
				<OpenInput placeholder="Search for a specific song" />
			</div>
			<div className="font-semibold mb-3">Your song library</div>

			<StackedList items={songListItems} />

			<div className="flex justify-end mt-2">
				<OpenButton color="blue" onClick={onCloseDialog} bold>
					Done
				</OpenButton>
			</div>
		</StyledDialog>
	);
}
