import { useEffect, useState } from "react";
import { useParams } from "react-router";
import SetlistApi from "../api/SetlistApi";
import { toShortDate } from "../utils/DateUtils";
import PageLoading from "./PageLoading";
import ClockIcon from "@heroicons/react/outline/ClockIcon";
import SetlistSongsList from "./SetlistSongsList";
import SectionTitle from "./SectionTitle";

export default function SetlistDetail() {
	const [setlist, setSetlist] = useState();
	const [loading, setLoading] = useState(true);
	const id = useParams().id;

	useEffect(() => (document.title = setlist ? setlist.name + " | Sets" : "Set"), [setlist]);
	useEffect(() => {
		async function fetchSetlist() {
			try {
				let { data } = await SetlistApi.getOne(id);
				setSetlist(data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}

		fetchSetlist();
	}, [id]);

	const handleSongsAdded = (songsAdded) => {
		setSetlist({ ...setlist, songs: [...setlist.songs, ...songsAdded] });
	};

	const handleSongsReordered = (reorderedSongs) => {
		setSetlist({ ...setlist, songs: reorderedSongs });
	};

	const handleSongRemoved = (songIdToRemove) => {
		let filteredSongs = setlist.songs?.filter((song) => song.id !== songIdToRemove);
		setSetlist({ ...setlist, songs: filteredSongs });
	};

	if (loading) {
		return <PageLoading />;
	} else {
		return (
			<>
				<div className="grid grid-cols-3 gap-x-5 w-full py-2">
					<div className="col-span-1">
						<div className="font-bold text-2xl mb-1">{setlist.name}</div>
						<div className="text-gray-500 flex items-center">
							<ClockIcon className="h-4 w-4 mr-2" />
							<span className="leading-6 h-6">{toShortDate(setlist.scheduled_date)}</span>
						</div>
					</div>
					<div className="col-span-2">
						<SetlistSongsList
							songs={setlist?.songs}
							onSongsAdded={handleSongsAdded}
							onReordered={handleSongsReordered}
							onSongRemoved={handleSongRemoved}
						/>
					</div>
				</div>
			</>
		);
	}
}
