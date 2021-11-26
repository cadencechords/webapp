import { format, getTimeFromDate } from "../utils/date";
import { useEffect, useState } from "react";

import EditEventSheet from "../components/EditEventSheet";
import EventColorOption from "../components/EventColorOption";
import EventDetailSheet from "../components/EventDetailSheet";
import StyledDialog from "../components/StyledDialog";

export default function EventDetailDialog({ open, event, onCloseDialog, onDeleted, onUpdated }) {
	const [startTime, setStartTime] = useState();
	const [endTime, setEndTime] = useState();
	const [sheet, setSheet] = useState();
	useEffect(() => {
		if (event?.start_time) {
			setStartTime(getTimeFromDate(event.start_time));
		}

		if (event?.end_time) {
			setEndTime(getTimeFromDate(event.end_time));
		}
	}, [event]);

	useEffect(() => {
		if (!open) {
			setSheet(null);
		}
	}, [open]);

	function constructTitle() {
		return (
			<div className="grid grid-cols-10 gap-6">
				<div className="flex items-center justify-end col-span-1">
					<EventColorOption className="flex-shrink-0" color={event?.color} />
				</div>
				<div className="col-span-9">
					<div className="text-2xl mb-1">{event?.title}</div>
					<div className="text-gray-600 dark:text-dark-gray-200">
						{format(event?.start_time, "MMMM D, YYYY")}&nbsp;
						{startTime && "(" + startTime}
						{startTime && endTime && "-"}
						{!startTime && endTime && "ends at "}
						{endTime}
						{startTime && ")"}
					</div>
				</div>
			</div>
		);
	}

	function getSheet() {
		if (sheet === "edit") {
			return <EditEventSheet event={event} onChangeSheet={setSheet} onEventUpdated={onUpdated} />;
		} else {
			return (
				<EventDetailSheet
					event={event}
					onDeleted={onDeleted}
					onCloseDialog={onCloseDialog}
					onChangeSheet={setSheet}
				/>
			);
		}
	}

	return (
		<StyledDialog
			open={open}
			onCloseDialog={onCloseDialog}
			title={constructTitle()}
			borderedTop={false}
			size="2xl"
			fullscreen={false}
		>
			{getSheet()}
		</StyledDialog>
	);
}
