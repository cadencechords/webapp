import AdjustmentsIcon from "@heroicons/react/outline/AdjustmentsIcon";
import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import Button from "./Button";
import KeyCapoOptionsPopover from "./KeyCapoOptionsPopover";
import { Link } from "react-router-dom";
import { hasAnyKeysSet } from "../utils/SongUtils";
import { useParams } from "react-router-dom";

export default function SongPresenterTopBar({ song, onShowOptionsDrawer, onShowBottomSheet }) {
	const { id } = useParams();

	if (song) {
		return (
			<nav className="py-2 px-1 border-b bg-gray-50">
				<div className="flex-between max-w-3xl mx-auto">
					<Link to={`/songs/${id}`}>
						<Button variant="open" color="gray">
							<ArrowNarrowLeftIcon className="h-6 w-6" />
						</Button>
					</Link>
					<h1 className="font-semibold w-1/3 text-center overflow-ellipsis whitespace-nowrap overflow-hidden">
						{song.name}
					</h1>
					<div className="flex items-center">
						{hasAnyKeysSet(song) && (
							<KeyCapoOptionsPopover onShowBottomSheet={onShowBottomSheet} song={song} />
						)}
						<Button variant="open" onClick={onShowOptionsDrawer} color="gray">
							<AdjustmentsIcon className="h-6 w-6" />
						</Button>
					</div>
				</div>
			</nav>
		);
	} else {
		return <nav className="py-2 px-1 border-b bg-gray-50 flex-between"></nav>;
	}
}
