import { useEffect, useState } from "react";

import { ADD_SETLISTS } from "../utils/constants";
import CreateSetlistDialog from "../components/CreateSetlistDialog";
import MobileHeaderAndBottomButton from "../components/MobileHeaderAndBottomButton";
import NoDataMessage from "../components/NoDataMessage";
import PageTitle from "../components/PageTitle";
import QuickAdd from "../components/QuickAdd";
import SetlistApi from "../api/SetlistApi";
import SetlistsList from "./SetlistsList";
import { reportError } from "../utils/error";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";

export default function SetlistsIndexPage() {
	useEffect(() => (document.title = "Sets"));
	const [setlists, setSetlists] = useState([]);
	const [upcomingSetlists, setUpcomingSetlists] = useState([]);
	const [pastSetlists, setPastSetlists] = useState([]);
	const [showCreateSetlistDialog, setShowCreateSetlistDialog] = useState(false);
	const [loading, setLoading] = useState(true);
	const currentMember = useSelector(selectCurrentMember);

	useEffect(() => {
		async function fetchSetlists() {
			setLoading(true);
			try {
				let { data } = await SetlistApi.getAll();
				setSetlists(data);
			} catch (error) {
				reportError(error);
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

	let content = null;

	if (setlists.length === 0) {
		content = <NoDataMessage loading={loading} type="set" />;
	} else {
		content = <SetlistsList upcomingSetlists={upcomingSetlists} pastSetlists={pastSetlists} />;
	}

	return (
		<>
			<div className="sm:hidden mt-14 mb-10">
				<MobileHeaderAndBottomButton
					buttonText="Add a set"
					onAdd={() => setShowCreateSetlistDialog(true)}
					pageTitle="Sets"
					canAdd={currentMember.can(ADD_SETLISTS)}
				/>
			</div>
			<div className="hidden sm:block">
				<PageTitle title="Sets" />
			</div>

			{content}

			{currentMember.can(ADD_SETLISTS) && (
				<>
					<div className="hidden sm:block">
						<QuickAdd onAdd={() => setShowCreateSetlistDialog(true)} />
					</div>
					<CreateSetlistDialog
						open={showCreateSetlistDialog}
						onCloseDialog={() => setShowCreateSetlistDialog(false)}
						onCreated={handleSetlistCreated}
					/>
				</>
			)}
		</>
	);
}
