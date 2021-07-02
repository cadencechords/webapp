import { useEffect, useState } from "react";
import SetlistApi from "../api/SetlistApi";
import PageTitle from "../components/PageTitle";
import PastSetsTable from "../components/PastSetsTable";
import UpcomingSetsTable from "../components/UpcomingSetsTable";
import QuickAdd from "../components/QuickAdd";
import CreateSetlistDialog from "../components/CreateSetlistDialog";
import PulseLoader from "react-spinners/PulseLoader";
import { useHistory } from "react-router";
import MobileHeaderAndBottomButton from "../components/MobileHeaderAndBottomButton";
import CenteredPage from "../components/CenteredPage";
import { toShortDate } from "../utils/DateUtils";
import CalendarIcon from "@heroicons/react/outline/CalendarIcon";
import MusicNoteIcon from "@heroicons/react/solid/MusicNoteIcon";

export default function SetlistsIndexPage() {
	useEffect(() => (document.title = "Sets"));
	const [setlists, setSetlists] = useState([]);
	const [upcomingSetlists, setUpcomingSetlists] = useState([]);
	const [pastSetlists, setPastSetlists] = useState([]);
	const [showCreateSetlistDialog, setShowCreateSetlistDialog] = useState(false);
	const [loading, setLoading] = useState(true);
	const router = useHistory();

	useEffect(() => {
		async function fetchSetlists() {
			setLoading(true);
			try {
				let { data } = await SetlistApi.getAll();
				setSetlists(data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}

		fetchSetlists();
	}, []);

	useEffect(() => {
		let now = new Date();
		let today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
		let past = setlists.filter((setlist) => {
			let scheduledDate = new Date(setlist.scheduled_date);
			let utcScheduledDate = new Date(
				Date.UTC(
					scheduledDate.getFullYear(),
					scheduledDate.getMonth(),
					scheduledDate.getDate(),
					24,
					0,
					0
				)
			);
			return today.getTime() > utcScheduledDate.getTime();
		});

		let upcoming = setlists.filter((setlist) => {
			let scheduledDate = new Date(setlist.scheduled_date);
			let utcScheduledDate = new Date(
				Date.UTC(
					scheduledDate.getFullYear(),
					scheduledDate.getMonth(),
					scheduledDate.getDate(),
					24,
					0,
					0
				)
			);
			return today.getTime() <= utcScheduledDate.getTime();
		});

		setPastSetlists(past);
		setUpcomingSetlists(upcoming);
	}, [setlists]);

	const handleSetlistCreated = (newSetlist) => {
		setSetlists([...setlists, newSetlist]);
	};

	const handleRouteToSetlist = (setlistId) => {
		router.push(`/sets/${setlistId}`);
	};

	if (loading) {
		return (
			<>
				<div className="hidden sm:block">
					<PageTitle title="Sets" />
					<div className="text-center py-4">
						<PulseLoader color="blue" />
					</div>
				</div>
				<div className="sm:hidden">
					<CenteredPage className="overflow-y-hidden">
						<div className="text-center">
							<PulseLoader color="blue" />
						</div>
					</CenteredPage>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="sm:hidden mt-14 mb-20">
				<MobileHeaderAndBottomButton
					buttonText="Add a set"
					onAdd={() => setShowCreateSetlistDialog(true)}
					pageTitle="Sets"
				/>
				<div className="mb-4">
					<h2 className="text-lg font-semibold">Upcoming</h2>
					{upcomingSetlists?.map((setlist) => (
						<div
							key={setlist.id}
							onClick={() => handleRouteToSetlist(setlist.id)}
							className="border-b last:border-0 py-2.5 px-2 hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
						>
							<div>{setlist.name}</div>
							<div className="text-sm text-gray-600 flex items-center">
								<div className="flex items-center">
									<CalendarIcon className="w-4 h-4 mr-2" />
									{toShortDate(setlist.scheduled_date)}
								</div>
								<div className="ml-5 flex items-center">
									<MusicNoteIcon className="w-4 h-4 mr-2" />
									{setlist.songs?.length}
								</div>
							</div>
						</div>
					))}
				</div>
				<div>
					<h2 className="text-lg font-semibold">Previous</h2>
					{pastSetlists?.map((setlist) => (
						<div
							key={setlist.id}
							onClick={() => handleRouteToSetlist(setlist.id)}
							className="border-b last:border-0 py-2.5 px-2 hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
						>
							<div>{setlist.name}</div>
							<div className="text-sm text-gray-600 flex items-center">
								<div className="flex items-center">
									<CalendarIcon className="w-4 h-4 mr-2" />
									{toShortDate(setlist.scheduled_date)}
								</div>
								<div className="ml-5 flex items-center">
									<MusicNoteIcon className="w-4 h-4 mr-2" />
									{setlist.songs?.length}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="hidden sm:block">
				<PageTitle title="Sets" />
				<UpcomingSetsTable setlists={upcomingSetlists} onClick={handleRouteToSetlist} />
				<PastSetsTable setlists={pastSetlists} onClick={handleRouteToSetlist} />
				<QuickAdd onAdd={() => setShowCreateSetlistDialog(true)} />
				<CreateSetlistDialog
					open={showCreateSetlistDialog}
					onCloseDialog={() => setShowCreateSetlistDialog(false)}
					onCreated={handleSetlistCreated}
				/>
			</div>
		</>
	);
}
