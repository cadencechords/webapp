import FullscreenDialog from "./FullscreenDialog";
import { toHtml } from "../utils/SongUtils";
import XIcon from "@heroicons/react/outline/XIcon";
import AdjustmentsIcon from "@heroicons/react/outline/AdjustmentsIcon";
import SwitchVerticalIcon from "@heroicons/react/outline/SwitchVerticalIcon";
import { useState } from "react";
import Button from "./Button";

export default function FullscreenSong({ song, open, onCloseDialog }) {
	const [showHiddenActions, setShowHiddenActions] = useState(false);
	const adjustmentsIcon = showHiddenActions ? (
		<XIcon className="h-7 text-gray-600" />
	) : (
		<AdjustmentsIcon className="h-7 text-gray-600" />
	);

	const hiddenActions = (
		<>
			<Button variant="open" color="black" className="flex items-center">
				<SwitchVerticalIcon className="mr-2 h-5 text-purple-600" />
				Transpose
			</Button>
		</>
	);

	return (
		<FullscreenDialog open={open} onCloseDialog={onCloseDialog}>
			<div className="sticky top-0 flex justify-end items-end flex-col">
				<button
					className="focus:outline-none outline-none rounded-full p-3 hover:bg-gray-100 transition-colors"
					onClick={onCloseDialog}
				>
					<XIcon className="h-7 text-gray-600" />
				</button>
			</div>
			<div className="px-1 sm:px-4 md:px-6">
				<div className="font-bold text-3xl mb-2 md:mb-4">{song.name}</div>
				<div
					className="whitespace-pre-wrap"
					style={{ fontFamily: song.font, fontSize: song.font_size + "px" }}
				>
					{toHtml(song.content, {
						boldChords: song.bold_chords,
						italicChords: song.italic_chords,
						showChordsDisabled: song.showChordsDisabled,
					})}
				</div>
			</div>
			<div className="sticky bottom-0 flex justify-end items-end flex-col">
				{showHiddenActions && hiddenActions}
				<button
					className="focus:outline-none outline-none rounded-full p-3 hover:bg-gray-100 transition-colors"
					onClick={() => setShowHiddenActions(!showHiddenActions)}
				>
					{adjustmentsIcon}
				</button>
			</div>
		</FullscreenDialog>
	);
}
