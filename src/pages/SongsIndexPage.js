import { selectSongsCache, setSongsCache } from "../store/cacheSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { ADD_SONGS } from "../utils/constants";
import Button from "../components/Button";
import CreateSongDialog from "../components/CreateSongDialog";
import FadeIn from "../components/FadeIn";
import MobileHeader from "../components/MobileHeader";
import NoDataMessage from "../components/NoDataMessage";
import PageTitle from "../components/PageTitle";
import PlusCircleIcon from "@heroicons/react/solid/PlusCircleIcon";
import QuickAdd from "../components/QuickAdd";
import SongApi from "../api/SongApi";
import SongsList from "../components/SongsList";
import WellInput from "../components/inputs/WellInput";
import { addToNow } from "../utils/date";
import { reportError } from "../utils/error";
import { selectCurrentMember } from "../store/authSlice";

export default function SongsIndexPage() {
	useEffect(() => (document.title = "Songs"));

	const [isCreating, setIsCreating] = useState(false);
	const [songs, setSongs] = useState([]);
	const [loading, setLoading] = useState(false);
	const currentMember = useSelector(selectCurrentMember);
	const [query, setQuery] = useState("");
	const songsCache = useSelector(selectSongsCache);
	const [loadingStatus, setLoadingStatus] = useState("not loaded");
	const dispatch = useDispatch();

	useEffect(() => {
		async function fetchSongs() {
			setLoading(true);
			try {
				let { data } = await SongApi.getAll();
				setSongs(data);

				let cache = {
					songs: data,
					expires: addToNow(30, "second").getTime(),
				};

				dispatch(setSongsCache(cache));
			} catch (error) {
				reportError(error);
			} finally {
				setLoading(false);
			}
		}

		function cacheValid() {
			return songsCache?.expires > new Date().getTime();
		}

		if (cacheValid() && loadingStatus === "not loaded") {
			setSongs(songsCache.songs);
			dispatch(setSongsCache({ ...songsCache, expires: addToNow(30, "second").getTime() }));
			setLoadingStatus("loaded");
		} else if (loadingStatus === "not loaded") {
			fetchSongs();
			setLoading("loaded");
		}
	}, [songsCache, dispatch, loadingStatus]);

	const handleSongCreated = (newSong) => {
		setSongs((currentSongs) => {
			dispatch(
				setSongsCache({
					songs: [newSong, ...currentSongs],
					expires: addToNow(30, "second").getTime(),
				})
			);
			return [newSong, ...currentSongs];
		});
	};

	let content = null;

	if (songs.length === 0) {
		content = <NoDataMessage type="songs" loading={loading} />;
	} else {
		content = (
			<FadeIn className="mb-10 delay-100">
				<SongsList songs={filteredSongs()} />
			</FadeIn>
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
					<FadeIn className="pl-2 mb-2">{songs.length} total</FadeIn>
					<FadeIn className="mb-4 lg:text-sm delay-75">
						<WellInput placeholder="Search your songs" value={query} onChange={setQuery} />
					</FadeIn>
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
						className="bg-white dark:bg-dark-gray-700 fixed bottom-12 left-0 flex-center sm:hidden h-12"
						full
						style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px -5px 17px 0px" }}
						onClick={() => setIsCreating(true)}
					>
						<PlusCircleIcon className="h-4 w-4 mr-2" />
						Add new song
					</Button>
				</>
			)}
		</>
	);
}
