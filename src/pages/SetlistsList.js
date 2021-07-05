import { useHistory } from "react-router";

import { toShortDate } from "../utils/DateUtils";
import CalendarIcon from "@heroicons/react/outline/CalendarIcon";
import MusicNoteIcon from "@heroicons/react/solid/MusicNoteIcon";
import PastSetsTable from "../components/PastSetsTable";
import UpcomingSetsTable from "../components/UpcomingSetsTable";

export default function SetlistsList({ upcomingSetlists, pastSetlists }) {
	const router = useHistory();

	const handleRouteToSetlist = (setlistId) => {
		router.push(`/sets/${setlistId}`);
	};

	return (
		<>
			<div className="sm:hidden">
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
				<UpcomingSetsTable setlists={upcomingSetlists} onClick={handleRouteToSetlist} />
				<PastSetsTable setlists={pastSetlists} onClick={handleRouteToSetlist} />
			</div>
		</>
	);
}
