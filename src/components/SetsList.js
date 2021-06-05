import { useEffect, useState } from "react";
import SetlistApi from "../api/SetlistApi";
import PageTitle from "./PageTitle";
import PastSetsTable from "./PastSetsTable";
import UpcomingSetsTable from "./UpcomingSetsTable";
import QuickAdd from "./QuickAdd";
import CreateSetlistDialog from "./CreateSetlistDialog";
import PulseLoader from "react-spinners/PulseLoader";
import { useHistory } from "react-router";

export default function SetsList() {
	useEffect(() => (document.title = "Sets"));
	const [setlists, setSetlists] = useState([]);
	const [upcomingSetlists, setUpcomingSetlists] = useState([]);
	const [pastSetlists, setPastSetlists] = useState([]);
	const [showCreateSetlistDialog, setShowCreateSetlistDialog] = useState(false);
	const [loading, setLoading] = useState(false);
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
		router.push(`/app/sets/${setlistId}`);
	};

	if (loading) {
		return (
			<>
				<PageTitle title="Sets" />
				<div className="text-center py-4">
					<PulseLoader color="blue" />
				</div>
			</>
		);
	}

	return (
		<>
			<PageTitle title="Sets" />
			<UpcomingSetsTable setlists={upcomingSetlists} onClick={handleRouteToSetlist} />
			<PastSetsTable setlists={pastSetlists} onClick={handleRouteToSetlist} />
			<QuickAdd onAdd={() => setShowCreateSetlistDialog(true)} />
			<CreateSetlistDialog
				open={showCreateSetlistDialog}
				onCloseDialog={() => setShowCreateSetlistDialog(false)}
				onCreated={handleSetlistCreated}
			/>
		</>
	);
}
