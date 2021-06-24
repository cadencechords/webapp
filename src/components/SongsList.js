import { useState, useEffect } from "react";
import CreateSongDialog from "./CreateSongDialog";
import PageTitle from "./PageTitle";
import QuickAdd from "./QuickAdd";
import SongsTable from "./SongsTable";
import PulseLoader from "react-spinners/PulseLoader";
import NoDataMessage from "./NoDataMessage";
import SongApi from "../api/SongApi";
import MobileHeader from "./MobileHeader";
import Button from "./Button";
import PlusCircleIcon from "@heroicons/react/solid/PlusCircleIcon";

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
		content = <NoDataMessage type="songs" />;
	} else {
		content = <SongsTable songs={songs} />;
	}

	return (
		<>
			<div className="hidden sm:block">
				<PageTitle title="Songs" />
			</div>
			<div className="h-14 mb-4 sm:hidden">
				<MobileHeader title="Songs" className="shadow-inner" onAdd={() => setIsCreating(true)} />
			</div>
			{content}
			<div className="hidden sm:block">
				<QuickAdd onAdd={() => setIsCreating(true)} />
			</div>
			<CreateSongDialog
				open={isCreating}
				onCloseDialog={() => setIsCreating(false)}
				onCreate={handleSongCreated}
			/>
			<Button
				variant="open"
				className="fixed bottom-12 left-0 rounded-none flex items-center justify-center sm:hidden h-12"
				full
				style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px -5px 17px 0px" }}
				onClick={() => setIsCreating(true)}
			>
				<PlusCircleIcon className="h-4 w-4 mr-2 text-blue-700" />
				Add new song
			</Button>
		</>
	);
}
