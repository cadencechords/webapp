import CalendarIcon from "@heroicons/react/outline/CalendarIcon";
import FadeIn from "./FadeIn";
import MusicNoteIcon from "@heroicons/react/solid/MusicNoteIcon";
import NoDataMessage from "./NoDataMessage";
import PastSetsTable from "./PastSetsTable";
import UpcomingSetsTable from "./UpcomingSetsTable";
import { toShortDate } from "../utils/DateUtils";
import { useHistory } from "react-router";

export default function SetlistsList({ upcomingSetlists, pastSetlists }) {
	const router = useHistory();

	const handleRouteToSetlist = (setlistId) => {
		router.push(`/sets/${setlistId}`);
	};

	return (
		<>
			<div className="sm:hidden mb-10">
				<div className="mb-4">
					<FadeIn className="text-lg font-semibold">Upcoming</FadeIn>
					{upcomingSetlists?.length > 0 ? (
						upcomingSetlists?.map((setlist) => (
							<FadeIn
								key={setlist.id}
								className="border-b dark:border-dark-gray-700 last:border-0 py-2.5 px-2 hover:bg-gray-50 focus:bg-gray-50 dark:hover:bg-dark-gray-800 dark:focus:bg-dark-gray-800 cursor-pointer delay-75"
							>
								<div onClick={() => handleRouteToSetlist(setlist.id)}>
									<div>{setlist.name}</div>
									<div className="text-sm text-gray-600 dark:text-dark-gray-200 flex items-center">
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
							</FadeIn>
						))
					) : (
						<FadeIn className="delay-75">
							<NoDataMessage>No upcoming sets to show</NoDataMessage>
						</FadeIn>
					)}
				</div>
				<div>
					<FadeIn className="text-lg font-semibold delay-100">Previous</FadeIn>
					{pastSetlists?.length > 0 ? (
						pastSetlists?.map((setlist) => (
							<FadeIn
								key={setlist.id}
								className="border-b dark:border-dark-gray-700 last:border-0 py-2.5 px-2 hover:bg-gray-50 focus:bg-gray-50 dark:hover:bg-dark-gray-800 dark:focus:bg-dark-gray-800 cursor-pointer delay-150"
							>
								<div onClick={() => handleRouteToSetlist(setlist.id)}>
									<div>{setlist.name}</div>
									<div className="text-sm text-gray-600 dark:text-dark-gray-200 flex items-center">
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
							</FadeIn>
						))
					) : (
						<FadeIn className="delay-150">
							<NoDataMessage>No previous sets to show</NoDataMessage>
						</FadeIn>
					)}
				</div>
			</div>
			<div className="hidden sm:block">
				<UpcomingSetsTable setlists={upcomingSetlists} onClick={handleRouteToSetlist} />
				<PastSetsTable setlists={pastSetlists} onClick={handleRouteToSetlist} />
			</div>
		</>
	);
}
