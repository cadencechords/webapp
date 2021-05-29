import { useState, useEffect } from "react";
import CreateSongDialog from "./CreateSongDialog";
import PageTitle from "./PageTitle";
import QuickAdd from "./QuickAdd";
import SongsTable from "./SongsTable";
import PulseLoader from "react-spinners/PulseLoader";
import NoDataMessage from "./NoDataMessage";
import SongApi from "../api/SongApi";

export default function SongsList() {
	useEffect(() => (document.title = "Songs"));

	const [isCreating, setIsCreating] = useState(false);
	const [songs, setSongs] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchSongs() {
			setLoading(true);
			try {
				let result = await SongApi.getAll();
				setSongs(result.data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}

		fetchSongs();
	}, []);

	const handleSongCreated = (newSong) => {
		setSongs([...songs, newSong]);
	};

	let content = null;

	if (loading) {
		content = (
			<div className="text-center py-4">
				<PulseLoader color="blue" />
			</div>
		);
	} else if (!loading && songs.length === 0) {
		content = <NoDataMessage type="song" />;
	} else {
		content = <SongsTable songs={songs} />;
	}

	return (
		<>
			<PageTitle title="Songs" />
			{content}
			<QuickAdd onAdd={() => setIsCreating(true)} />
			<CreateSongDialog
				open={isCreating}
				onCloseDialog={() => setIsCreating(false)}
				onCreate={handleSongCreated}
			/>
		</>
	);
}
