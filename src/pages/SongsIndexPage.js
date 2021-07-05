import PlusCircleIcon from "@heroicons/react/solid/PlusCircleIcon";
import { useState, useEffect } from "react";

import CreateSongDialog from "../components/CreateSongDialog";
import PageTitle from "../components/PageTitle";
import QuickAdd from "../components/QuickAdd";
import SongsList from "../components/SongsList";
import NoDataMessage from "../components/NoDataMessage";
import SongApi from "../api/SongApi";
import MobileHeader from "../components/MobileHeader";
import Button from "../components/Button";

export default function SongsIndexPage() {
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

	if (songs.length === 0) {
		content = <NoDataMessage type="songs" loading={loading} />;
	} else {
		content = (
			<div className="mb-10">
				<SongsList songs={songs} />
			</div>
		);
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
				className="bg-white fixed bottom-12 left-0 rounded-none flex-center sm:hidden h-12"
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
