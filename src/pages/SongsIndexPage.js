import { useEffect, useState } from "react";

import { ADD_SONGS } from "../utils/constants";
import Button from "../components/Button";
import CreateSongDialog from "../components/CreateSongDialog";
import MobileHeader from "../components/MobileHeader";
import NoDataMessage from "../components/NoDataMessage";
import PageTitle from "../components/PageTitle";
import PlusCircleIcon from "@heroicons/react/solid/PlusCircleIcon";
import QuickAdd from "../components/QuickAdd";
import SongApi from "../api/SongApi";
import SongsList from "../components/SongsList";
import WellInput from "../components/inputs/WellInput";
import { reportError } from "../utils/error";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";

export default function SongsIndexPage() {
	useEffect(() => (document.title = "Songs"));

	const [isCreating, setIsCreating] = useState(false);
	const [songs, setSongs] = useState([]);
	const [loading, setLoading] = useState(false);
	const currentMember = useSelector(selectCurrentMember);
	const [query, setQuery] = useState("");

	useEffect(() => {
		async function fetchSongs() {
			setLoading(true);
			try {
				let result = await SongApi.getAll();
				setSongs(result.data);
			} catch (error) {
				reportError(error);
			} finally {
				setLoading(false);
			}
		}

		fetchSongs();
	}, []);

	useEffect(() => {
		if (songs?.length > 0) {
			animateFadeIn();
		}
	}, [songs]);

	const animateFadeIn = () => {
		setTimeout(() => {
			document.getElementById("count")?.classList.toggle("translate-y-6");
			document.getElementById("count")?.classList.toggle("opacity-0");
			document.getElementById("search")?.classList.toggle("translate-y-6");
			document.getElementById("search")?.classList.toggle("opacity-0");
			document.getElementById("songs")?.classList.toggle("translate-y-6");
			document.getElementById("songs")?.classList.toggle("opacity-0");
		}, [1]);
	};

	const handleSongCreated = (newSong) => {
		setSongs([...songs, newSong]);
	};

	let content = null;

	if (songs.length === 0) {
		content = <NoDataMessage type="songs" loading={loading} />;
	} else {
		content = (
			<div
				className="mb-10  translate-y-6 transform transition-all ease-out opacity-0 delay-150 duration-500"
				id="songs"
			>
				<SongsList songs={filteredSongs()} />
			</div>
		);
	}

	function filteredSongs() {
		return songs?.filter((song) => song.name.toLowerCase().includes(query.toLowerCase()));
	}

	return (
		<>
			<div className="hidden sm:block">
				<PageTitle title="Songs" />
			</div>
			<div className="h-14 mb-4 sm:hidden">
				<MobileHeader
					title="Songs"
					className="shadow-inner"
					onAdd={() => setIsCreating(true)}
					canAdd={currentMember.can(ADD_SONGS)}
				/>
			</div>
			{songs.length > 0 && (
				<>
					<div
						className="pl-2 mb-2 translate-y-6 transform transition-all ease-out opacity-0  duration-500"
						id="count"
					>
						{songs.length} total
					</div>
					<WellInput
						placeholder="Search your songs"
						className="mb-4 lg:text-sm translate-y-6 transform transition-all ease-out opacity-0 delay-100  duration-500"
						value={query}
						onChange={setQuery}
						id="search"
					/>
				</>
			)}
			{content}

			{currentMember.can(ADD_SONGS) && (
				<>
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
			)}
		</>
	);
}
