import StyledDialog from "./StyledDialog";
import OpenInput from "./inputs/OpenInput";
import Checkbox from "./Checkbox";
import { useEffect, useState } from "react";
import StackedList from "./StackedList";
import OpenButton from "./buttons/OpenButton";
import SongApi from "../api/SongApi";
import PulseLoader from "react-spinners/PulseLoader";

export default function SearchSongsDialog({ open, onCloseDialog, boundSongs, onChange }) {
	const [songs, setSongs] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchSongs() {
			setLoading(true);
			try {
				let { data } = await SongApi.getAll();
				setSongs(data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}
		fetchSongs();
	}, []);

	const isBoundAlready = (song) => {
		return boundSongs.findIndex((boundSong) => boundSong.id === song.id) > -1;
	};

	const handleChange = (checked, song) => {
		if (checked) {
			let updatedBoundSongs = [...boundSongs, song];
			onChange(updatedBoundSongs);
		} else {
			let updatedBoundSongs = boundSongs.filter((boundSong) => boundSong.id !== song.id);
			onChange(updatedBoundSongs);
		}
	};

	const songListItems = songs.map((song) => (
		<div key={song.id} className="flex items-center">
			<Checkbox
				checked={isBoundAlready(song)}
				color="blue"
				onChange={(value) => handleChange(value, song)}
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

			{loading ? (
				<div className="text-center">
					<PulseLoader color="blue" />
				</div>
			) : (
				<StackedList items={songListItems} />
			)}

			<div className="flex justify-end mt-2">
				<OpenButton color="blue" onClick={onCloseDialog} bold>
					Done
				</OpenButton>
			</div>
		</StyledDialog>
	);
}

SearchSongsDialog.defaultProps = {
	boundSongs: [],
};
