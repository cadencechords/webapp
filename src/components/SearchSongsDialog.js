import { useEffect, useState } from "react";

import BinderApi from "../api/BinderApi";
import Button from "./Button";
import Checkbox from "./Checkbox";
import OpenInput from "./inputs/OpenInput";
import PulseLoader from "react-spinners/PulseLoader";
import SongApi from "../api/SongApi";
import StackedList from "./StackedList";
import StyledDialog from "./StyledDialog";
import { noop } from "../utils/constants";
import { reportError } from "../utils/error";
import { useHistory } from "react-router";
import { useParams } from "react-router";

export default function SearchSongsDialog({ open, onCloseDialog, boundSongs, onAdd }) {
	const [songs, setSongs] = useState([]);
	const [songsToAdd, setSongsToAdd] = useState([]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [query, setQuery] = useState("");
	const { id } = useParams();
	const router = useHistory();

	useEffect(() => {
		async function fetchSongs() {
			setLoading(true);
			try {
				let { data } = await SongApi.getAll();
				let boundSongIds = boundSongs?.map((song) => song.id);
				let unboundSongs = data.filter((song) => !boundSongIds.includes(song.id));
				setSongs(unboundSongs);
			} catch (error) {
				reportError(error);
				if (error?.response?.status === 401) {
					router.push("/login");
				}
			} finally {
				setLoading(false);
			}
		}
		fetchSongs();
	}, [boundSongs, router]);

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
		setQuery("");
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
			reportError(error);
			setSaving(false);
			if (error?.response?.status === 401) {
				router.push("/login");
			}
		}
	};

	const filteredSongs = () => {
		if (query !== "") {
			let lowercasedQuery = query.toLowerCase();
			return songs?.filter((song) => song.name.toLowerCase().includes(lowercasedQuery)) || [];
		} else {
			return songs;
		}
	};

	const songListItems = filteredSongs().map((song) => {
		let checked = songsToAdd.includes(song);
		return (
			<div
				key={song.id}
				className="flex items-center cursor-pointer px-1"
				onClick={() => handleChecked(!checked, song)}
			>
				<Checkbox checked={checked} color="blue" onChange={noop} />
				<span className="ml-4">{song.name}</span>
			</div>
		);
	});

	return (
		<StyledDialog open={open} onCloseDialog={handleClose} borderedTop={false}>
			<div className="border-b pb-2 mb-7">
				<OpenInput placeholder="Search for a specific song" value={query} onChange={setQuery} />
			</div>
			<div className="font-semibold mb-3">Your song library</div>

			{loading ? (
				<div className="text-center">
					<PulseLoader color="blue" />
				</div>
			) : (
				<div className="max-h-96 overflow-y-auto">
					<StackedList items={songListItems} />
				</div>
			)}

			<div className="flex justify-between mt-6 items-center">
				<span className="w-1/2 mr-2">
					<Button onClick={handleSaveAdds} full disabled={songsToAdd.length === 0} loading={saving}>
						Add {songsToAdd.length} song{songsToAdd.length === 1 ? "" : "s"}
					</Button>
				</span>
				<span className="w-1/2 ml-2">
					<Button variant="open" color="black" full onClick={handleClose}>
						Cancel
					</Button>
				</span>
			</div>
		</StyledDialog>
	);
}

SearchSongsDialog.defaultProps = {
	boundSongs: [],
};
