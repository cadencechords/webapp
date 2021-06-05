import { useState } from "react";
import { useHistory, useParams } from "react-router";
import SetlistApi from "../api/SetlistApi";
import AddSongsToSetDialog from "./AddSongsToSetDialog";
import OpenButton from "./buttons/OpenButton";
import DragAndDropTable from "./DragAndDropTable";

export default function SetlistSongsList({ songs, onSongsAdded, onReordered, onSongRemoved }) {
	const [showSongsDialog, setShowSongsDialog] = useState(false);
	const id = useParams().id;
	const router = useHistory();
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
			console.log(error);
		}
	};

	const handleRemoveSong = async (songIdToRemove) => {
		try {
			await SetlistApi.removeSongs(id, [songIdToRemove]);
			onSongRemoved(songIdToRemove);
		} catch (error) {
			console.log(error);
		}
	};

	const handleRouteToSongDetail = (songId) => {
		router.push(`/app/songs/${songId}`);
	};

	return (
		<>
			<div className="font-semibold pb-2 flex justify-between items-center border-b">
				Songs
				<OpenButton bold color="blue" onClick={() => setShowSongsDialog(true)}>
					Add Song
				</OpenButton>
			</div>

			<DragAndDropTable
				items={songs}
				onReorder={handleReordered}
				removeable
				onRemove={handleRemoveSong}
				onClick={handleRouteToSongDetail}
			/>

			<AddSongsToSetDialog
				open={showSongsDialog}
				onCloseDialog={() => setShowSongsDialog(false)}
				onAdded={onSongsAdded}
				boundSongs={songs}
			/>
		</>
	);
}
