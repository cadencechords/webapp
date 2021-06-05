import { useEffect, useState, useCallback } from "react";
import { useHistory, useParams } from "react-router";
import SetlistApi from "../api/SetlistApi";
import { toShortDate } from "../utils/DateUtils";
import PageLoading from "./PageLoading";
import ClockIcon from "@heroicons/react/outline/ClockIcon";
import SetlistSongsList from "./SetlistSongsList";
import SectionTitle from "./SectionTitle";
import PageTitle from "./PageTitle";
import _ from "lodash";
import Button from "./Button";

export default function SetlistDetail() {
	const [setlist, setSetlist] = useState();
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState(false);
	const router = useHistory();
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

	const handleNameChange = (newName) => {
		setSetlist({ ...setlist, name: newName });
		debounce(newName);
	};

	const debounce = useCallback(
		_.debounce((newName) => {
			try {
				SetlistApi.updateOne({ name: newName }, id);
			} catch (error) {
				console.log(error);
			}
		}, 1000),
		[]
	);

	const handleDelete = async () => {
		setDeleting(true);
		try {
			await SetlistApi.deleteOne(id);
			router.push("/app/sets");
		} catch (error) {
			console.log(error);
			setDeleting(false);
		}
	};

	if (loading) {
		return <PageLoading />;
	} else {
		return (
			<>
				<div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full py-2">
					<div className="col-span-1">
						<PageTitle title={setlist.name} editable onChange={handleNameChange} />
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
				<div>
					<SectionTitle title="Delete" underline />
					<Button color="red" loading={deleting} onClick={handleDelete}>
						Delete this set
					</Button>
				</div>
			</>
		);
	}
}
