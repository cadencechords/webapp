import { useHistory, useParams } from "react-router";

import AddSongsToSetDialog from "./AddSongsToSetDialog";
import Button from "./Button";
import DragAndDropTable from "./DragAndDropTable";
import { EDIT_SETLISTS } from "../utils/constants";
import NoDataMessage from "./NoDataMessage";
import SetlistApi from "../api/SetlistApi";
import { reportError } from "../utils/error";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function SetlistSongsList({ songs, onSongsAdded, onReordered, onSongRemoved }) {
	const [showSongsDialog, setShowSongsDialog] = useState(false);
	const id = useParams().id;
	const router = useHistory();
	const currentMember = useSelector(selectCurrentMember);
	const handleReordered = async (reorderedSongs, movedSong) => {
		reorderedSongs = reorderedSongs.map((reorderedSong, index) => ({
			...reorderedSong,
			position: index,
		}));
		onReordered(reorderedSongs);

		try {
			let updates = { position: movedSong.newPosition };
			await SetlistApi.updateScheduledSong(updates, Number.parseInt(movedSong.id), id);
		} catch (error) {
			reportError(error);
		}
	};

	const handleRemoveSong = async (songIdToRemove) => {
		try {
			await SetlistApi.removeSongs(id, [songIdToRemove]);
			onSongRemoved(songIdToRemove);
		} catch (error) {
			reportError(error);
		}
	};

	const handleRouteToSongDetail = (songId) => {
		router.push(`/songs/${songId}`);
	};

	return (
		<>
			<div className="font-semibold text-lg pb-2 flex-between border-b dark:border-dark-gray-600">
				Songs
				{currentMember.can(EDIT_SETLISTS) && (
					<Button size="xs" variant="open" onClick={() => setShowSongsDialog(true)}>
						Add Song
					</Button>
				)}
			</div>

			{songs?.length > 0 ? (
				<DragAndDropTable
					items={songs}
					onReorder={handleReordered}
					removeable={currentMember.can(EDIT_SETLISTS)}
					onRemove={handleRemoveSong}
					onClick={handleRouteToSongDetail}
					rearrangeable={currentMember.can(EDIT_SETLISTS)}
				/>
			) : (
				<NoDataMessage type="songs" />
			)}

			<AddSongsToSetDialog
				open={showSongsDialog}
				onCloseDialog={() => setShowSongsDialog(false)}
				onAdded={onSongsAdded}
				boundSongs={songs}
			/>
		</>
	);
}
