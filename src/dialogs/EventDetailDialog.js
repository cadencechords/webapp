import { format, getTimeFromDate } from "../utils/date";
import { useEffect, useState } from "react";

import BellIcon from "@heroicons/react/outline/BellIcon";
import Button from "../components/Button";
import { DELETE_EVENTS } from "../utils/constants";
import EventColorOption from "../components/EventColorOption";
import MenuAlt2Icon from "@heroicons/react/outline/MenuAlt2Icon";
import StyledDialog from "../components/StyledDialog";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import UsersIcon from "@heroicons/react/solid/UsersIcon";
import eventsApi from "../api/eventsApi";
import { hasName } from "../utils/model";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";

export default function EventDetailDialog({ open, event, onCloseDialog, onDeleted }) {
	const [startTime, setStartTime] = useState();
	const [endTime, setEndTime] = useState();
	const currentMember = useSelector(selectCurrentMember);
	useEffect(() => {
		if (event?.start_time) {
			setStartTime(getTimeFromDate(event.start_time));
		}

		if (event?.end_time) {
			setEndTime(getTimeFromDate(event.end_time));
		}
	}, [event]);

	function constructTitle() {
		return (
			<div className="grid grid-cols-10 gap-6">
				<div className="flex items-center justify-end col-span-1">
					<EventColorOption color={event?.color} />
				</div>
				<div className="col-span-9">
					<div className="text-2xl mb-1">{event?.title}</div>
					<div className="text-gray-600">
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

	function handleDelete() {
		eventsApi.delete(event.id);
		onDeleted(event.id);
		onCloseDialog();
	}

	return (
		<StyledDialog
			open={open}
			onCloseDialog={onCloseDialog}
			title={constructTitle()}
			borderedTop={false}
			size="lg"
			fullscreen={false}
		>
			{event && (
				<div className="grid grid-cols-10 gap-6">
					<div className="col-span-1 flex justify-end items-start">
						<UsersIcon className="text-gray-600 w-5 h-5 my-1" />
					</div>
					<div className="col-span-9 flex justify-start items-start">
						{event?.memberships?.length > 0 ? (
							event.memberships.map((member) => (
								<div key={member.id} className="my-1">
									{hasName(member.user)
										? `${member.user.first_name} ${member.user.last_name}`
										: member.user.email}
								</div>
							))
						) : (
							<div className="text-gray-600">No members</div>
						)}
					</div>
					<div className="col-span-1 flex justify-end items-start">
						<BellIcon className="text-gray-600 w-5 h-5" />
					</div>
					<div className="col-span-9 flex justify-start items-start">
						{event.reminders_enabled ? (
							`Reminders will be sent ${format(event.reminder_date, "MMMM D, YYYY h:mma")}`
						) : (
							<div className="text-gray-600">Reminders are not enabled for this event</div>
						)}
					</div>

					<div className="col-span-1 flex justify-end items-start">
						<MenuAlt2Icon className="text-gray-600 w-5 h-5" />
					</div>
					<div className="col-span-9 flex justify-start items-start">
						{event.description ? (
							event.description
						) : (
							<div className="text-gray-600">No description provided for this event</div>
						)}
					</div>
				</div>
			)}
			{currentMember?.can(DELETE_EVENTS) && (
				<div className="mt-4 flex justify-end">
					<Button variant="open" color="gray" onClick={handleDelete}>
						<TrashIcon className="h-5 w-5" />
					</Button>
				</div>
			)}
		</StyledDialog>
	);
}
