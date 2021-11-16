import { Link, useParams } from "react-router-dom";

import AdjustmentsIcon from "@heroicons/react/outline/AdjustmentsIcon";
import Button from "./Button";
import KeyCapoOptionsPopover from "./KeyCapoOptionsPopover";
import XIcon from "@heroicons/react/outline/XIcon";
import { hasAnyKeysSet } from "../utils/SongUtils";

export default function SetPresenterTopBar({ song, onShowBottomSheet, onShowDrawer }) {
	const { id } = useParams();

	if (!song) return null;

	return (
		<nav className="py-2 px-1 border-b bg-gray-50">
			<div className="flex-between max-w-3xl mx-auto">
				<Link to={`/sets/${id}`}>
					<Button variant="open" color="gray">
						<XIcon className="w-5 h-5 sm:h-6 sm:w-6" />
					</Button>
				</Link>
				<h1 className="font-semibold w-1/3 text-center overflow-ellipsis whitespace-nowrap overflow-hidden">
					{song.name}
				</h1>
				<div className="flex items-center">
					{hasAnyKeysSet(song) && (
						<KeyCapoOptionsPopover song={song} onShowBottomSheet={onShowBottomSheet} />
					)}
					<Button variant="open" color="gray" onClick={onShowDrawer}>
						<AdjustmentsIcon className="w-5 h-5 sm:h-6 sm:w-6" />
					</Button>
				</div>
			</div>
		</nav>
	);
}
