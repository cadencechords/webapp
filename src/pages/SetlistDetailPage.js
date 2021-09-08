import { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import Alert from "../components/Alert";
import Button from "../components/Button";
import CalendarIcon from "@heroicons/react/outline/CalendarIcon";
import ChangeSetlistDateDialog from "../components/ChangeSetlistDateDialog";
import GlobeIcon from "@heroicons/react/outline/GlobeIcon";
import PageLoading from "../components/PageLoading";
import PageTitle from "../components/PageTitle";
import PlayIcon from "@heroicons/react/solid/PlayIcon";
import PublicSetlistApi from "../api/PublicSetlistApi";
import PublicSetlistDetailsDialog from "../dialogs/PublicSetlistDetailsDialog";
import PublishSetlistDialog from "../components/PublishSetlistDialog";
import SectionTitle from "../components/SectionTitle";
import SetlistApi from "../api/SetlistApi";
import SetlistSongsList from "../components/SetlistSongsList";
import _ from "lodash";
import { setSetlistBeingPresented } from "../store/presenterSlice";
import { toShortDate } from "../utils/DateUtils";
import { useDispatch } from "react-redux";

export default function SetlistDetailPage() {
	const [setlist, setSetlist] = useState();
	const [publicSetlist, setPublicSetlist] = useState();
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState(false);
	const [showChangeDateDialog, setShowChangeDateDialog] = useState(false);
	const [showPublishSetlistDialog, setShowPublishSetlistDialog] = useState(false);
	const [showPublicSetlistDetailsDialog, setShowPublicSetlistDetailsDialog] = useState(false);
	const router = useHistory();
	const id = useParams().id;
	const dispatch = useDispatch();

	useEffect(() => (document.title = setlist ? setlist.name + " | Sets" : "Set"), [setlist]);
	useEffect(() => {
		async function fetchData() {
			try {
				let result = await SetlistApi.getOne(id);
				setSetlist(result.data);

				result = await PublicSetlistApi.getOne(id);
				setPublicSetlist(result.data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
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

	const handleOpenInPresenter = () => {
		dispatch(setSetlistBeingPresented(setlist));
		router.push(`/sets/${id}/present`);
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
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
			router.push("/sets");
		} catch (error) {
			console.log(error);
			setDeleting(false);
		}
	};

	if (loading) {
		return <PageLoading />;
	} else {
		return (
			<div className="mt-4">
				{publicSetlist && (
					<Alert className="mb-4">
						This set is currently public{" "}
						<Button
							variant="open"
							size="small"
							onClick={() => setShowPublicSetlistDetailsDialog(true)}
						>
							View details
						</Button>
					</Alert>
				)}
				<div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full py-2">
					<div className="col-span-1">
						<PageTitle title={setlist.name} editable onChange={handleNameChange} />
						<div
							className="text-gray-500 flex items-center cursor-pointer mb-4"
							onClick={() => setShowChangeDateDialog(true)}
						>
							<CalendarIcon className="h-4 w-4 mr-2" />
							<span className="leading-6 h-6">{toShortDate(setlist.scheduled_date)}</span>
						</div>
						<Button
							variant="outlined"
							color="black"
							onClick={handleOpenInPresenter}
							className="flex-center mb-2"
							size="xs"
						>
							<PlayIcon className="h-4 w-4 text-purple-700 mr-1" /> Present
						</Button>
						{!publicSetlist && (
							<Button
								variant="outlined"
								color="black"
								className="flex-center"
								size="xs"
								onClick={() => setShowPublishSetlistDialog(true)}
							>
								<GlobeIcon className="h-4 w-4 mr-1 text-blue-700" />
								Publish
							</Button>
						)}
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
				<ChangeSetlistDateDialog
					open={showChangeDateDialog}
					onCloseDialog={() => setShowChangeDateDialog(false)}
					scheduledDate={setlist.scheduled_date}
					onDateChanged={(newScheduledDate) =>
						setSetlist({ ...setlist, scheduled_date: newScheduledDate })
					}
				/>
				<PublishSetlistDialog
					open={showPublishSetlistDialog}
					onCloseDialog={() => setShowPublishSetlistDialog(false)}
					onSetlistPublished={setPublicSetlist}
				/>
				<PublicSetlistDetailsDialog
					open={showPublicSetlistDetailsDialog}
					publicSetlist={publicSetlist}
					onCloseDialog={() => setShowPublicSetlistDetailsDialog(false)}
					onUnpublished={() => setPublicSetlist(null)}
				/>
			</div>
		);
	}
}
