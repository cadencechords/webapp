import StyledDialog from "./StyledDialog";
import AddCancelActions from "./buttons/AddCancelActions";
import WellInput from "./inputs/WellInput";
import StackedList from "./StackedList";
import { useEffect, useState } from "react";
import SongApi from "../api/SongApi";
import Checkbox from "./Checkbox";
import SetlistApi from "../api/SetlistApi";
import { useParams } from "react-router";

export default function AddSongsToSetDialog({ open, onCloseDialog, onAdded, boundSongs }) {
	const [songs, setSongs] = useState([]);
	const [songsToAdd, setSongsToAdd] = useState([]);
	const [query, setQuery] = useState("");
	const [filteredSongs, setFilteredSongs] = useState([]);
	const [savingAdds, setSavingAdds] = useState(false);

	const id = useParams().id;

	useEffect(() => {
		async function fetchSongs() {
			if (open) {
				try {
					let { data } = await SongApi.getAll();
					let boundSongIds = boundSongs.map((boundSong) => boundSong.id);
					let unboundSongs = data.filter((song) => !boundSongIds.includes(song.id));
					setSongs(unboundSongs);
				} catch (error) {
					console.log(error);
				}
			}
		}

		fetchSongs();
	}, [open, boundSongs]);

	useEffect(() => {
		setFilteredSongs(songs.filter((song) => song.name.toLowerCase().includes(query.toLowerCase())));
	}, [query, songs]);

	const handleChecked = (shouldAdd, song) => {
		let songsSet = new Set(songsToAdd);
		if (shouldAdd) {
			songsSet.add(song);
		} else {
			songsSet.delete(song);
		}

		setSongsToAdd(Array.from(songsSet));
	};

	const clearFields = () => {
		setSongs([]);
		setSongsToAdd([]);
		setQuery("");
		setFilteredSongs([]);
	};

	const handleCloseDialog = () => {
		clearFields();
		onCloseDialog();
	};

	const songListItems = filteredSongs.map((song) => (
		<div key={song.id} className="flex-center">
			<Checkbox
				checked={songsToAdd.includes(song)}
				color="blue"
				onChange={(value) => handleChecked(value, song)}
			/>
			<span className="ml-4">{song.name}</span>
		</div>
	));

	const handleSaveAdds = async () => {
		setSavingAdds(true);
		try {
			let songIdsToAdd = songsToAdd.map((song) => song.id);
			let { data } = await SetlistApi.addSongs(id, songIdsToAdd);
			onAdded(data);
			handleCloseDialog();
		} catch (error) {
			console.log(error);
		} finally {
			setSavingAdds(false);
		}
	};

	return (
		<StyledDialog title="Add songs to this set" open={open} onCloseDialog={handleCloseDialog}>
			<div className="mb-4">
				<WellInput onChange={setQuery} value={query} />
			</div>
			<StackedList items={songListItems} />
			<AddCancelActions
				addText={songsToAdd.length !== 1 ? `Add ${songsToAdd.length} songs` : "Add 1 song"}
				onCancel={handleCloseDialog}
				loadingAdd={savingAdds}
				onAdd={handleSaveAdds}
				addDisabled={songsToAdd.length === 0}
			/>
		</StyledDialog>
	);
}
