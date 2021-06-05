import StyledDialog from "./StyledDialog";
import OpenInput from "./inputs/OpenInput";
import Checkbox from "./Checkbox";
import { useEffect, useState } from "react";
import StackedList from "./StackedList";
import OpenButton from "./buttons/OpenButton";
import SongApi from "../api/SongApi";
import PulseLoader from "react-spinners/PulseLoader";
import BinderApi from "../api/BinderApi";
import { useParams } from "react-router";
import Button from "./Button";

export default function SearchSongsDialog({ open, onCloseDialog, boundSongs, onAdd }) {
	const [songs, setSongs] = useState([]);
	const [songsToAdd, setSongsToAdd] = useState([]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const { id } = useParams();

	useEffect(() => {
		async function fetchSongs() {
			setLoading(true);
			try {
				let { data } = await SongApi.getAll();
				let boundSongIds = boundSongs?.map((song) => song.id);
				let unboundSongs = data.filter((song) => !boundSongIds.includes(song.id));
				setSongs(unboundSongs);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}
		fetchSongs();
	}, [boundSongs]);

	const handleChecked = (shouldAdd, song) => {
		let songsSet = new Set(songsToAdd);
		if (shouldAdd) {
			songsSet.add(song);
		} else {
			songsSet.delete(song);
		}

		setSongsToAdd(Array.from(songsSet));
	};

	const handleClose = () => {
		setSongsToAdd([]);
		onCloseDialog();
	};

	const handleSaveAdds = async () => {
		setSaving(true);
		try {
			let songIdsToAdd = songsToAdd.map((song) => song.id);
			let { data } = await BinderApi.addSongs(id, songIdsToAdd);
			onAdd(data);
			setSaving(false);
			handleClose();
		} catch (error) {
			console.log(error);
			setSaving(false);
		}
	};

	const songListItems = songs.map((song) => (
		<div key={song.id} className="flex items-center">
			<Checkbox
				checked={songsToAdd.includes(song)}
				color="blue"
				onChange={(value) => handleChecked(value, song)}
			/>
			<span className="ml-4">{song.name}</span>
		</div>
	));

	return (
		<StyledDialog open={open} onCloseDialog={handleClose} borderedTop={false}>
			<div className="border-b pb-2 mb-7">
				<OpenInput placeholder="Search for a specific song" />
			</div>
			<div className="font-semibold mb-3">Your song library</div>

			{loading ? (
				<div className="text-center">
					<PulseLoader color="blue" />
				</div>
			) : (
				<StackedList items={songListItems} />
			)}

			<div className="flex justify-between mt-6 items-center">
				<span className="w-1/2 mr-2">
					<Button onClick={handleSaveAdds} full disabled={songsToAdd.length === 0} loading={saving}>
						Add {songsToAdd.length} song{songsToAdd.length === 1 ? "" : "s"}
					</Button>
				</span>
				<span className="w-1/2 ml-2">
					<OpenButton full bold onClick={handleClose}>
						Cancel
					</OpenButton>
				</span>
			</div>
		</StyledDialog>
	);
}

SearchSongsDialog.defaultProps = {
	boundSongs: [],
};
