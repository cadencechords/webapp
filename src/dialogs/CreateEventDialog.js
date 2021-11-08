import { combineDateAndTime, isValidTime, subtractHours } from "../utils/date";
import { useCallback, useEffect, useState } from "react";

import Button from "../components/Button";
import EventAdvancedOptions from "../components/EventAdvancedOptions";
import EventBasicDetails from "../components/EventBasicDetails";
import StyledDialog from "../components/StyledDialog";
import eventsApi from "../api/eventsApi";
import { reportError } from "../utils/error";

export default function CreateEventDialog({ open, onCloseDialog, defaultDate, onEventCreated }) {
	const [event, setEvent] = useState({
		members: [],
		reminders_enabled: true,
		reminder_date: 1,
		color: "blue",
	});
	const [members, setMembers] = useState();
	const [loading, setLoading] = useState(false);

	const handleFieldChange = useCallback((field, value) => {
		if (!value) {
			setEvent((currentEvent) => {
				let updated = { ...currentEvent };
				delete updated[field];
				return updated;
			});
		} else {
			setEvent((currentEvent) => ({ ...currentEvent, [field]: value }));
		}
	}, []);

	useEffect(() => {
		setEvent((currentEvent) => ({ ...currentEvent, date: defaultDate }));
	}, [defaultDate]);

	const handleMembersLoaded = (loadedMembers) => {
		setMembers(loadedMembers);
		setEvent((currentEvent) => ({ ...currentEvent, members: loadedMembers }));
	};

	const handleSave = async () => {
		let createRequest = toCreateRequest();
		try {
			setLoading(true);
			let { data } = await eventsApi.create(createRequest);
			onEventCreated(data);
			handleCloseDialog();
		} catch (error) {
			reportError(error);
			setLoading(false);
		}
	};

	const clearFields = () => {
		setEvent({
			members: members,
			reminders_enabled: true,
			reminder_date: 1,
			color: "blue",
		});
		setLoading(false);
	};

	const isValid = () => {
		return hasBasicDetails() && hasValidTimes();
	};

	const hasBasicDetails = () => {
		return event?.title && event?.date;
	};

	const hasValidTimes = () => {
		if (event?.start_time && event?.end_time) {
			return isValidTime(event.start_time) && isValidTime(event.end_time);
		} else if (event?.start_time) {
			return isValidTime(event.start_time);
		} else if (event?.end_time) {
			return isValidTime(event.end_time);
		} else {
			return true;
		}
	};

	const toCreateRequest = () => {
		let request = { ...event };

		delete request.members;
		if (event?.members) {
			request.membership_ids = event.members.map((member) => member.id);
		}

		delete request.date;
		delete request.start_time;
		delete request.end_time;

		request.start_time = combineDateAndTime(event.date, event.start_time);

		if (event?.end_time) {
			request.end_time = combineDateAndTime(event.date, event.end_time);
		}

		delete request.reminder_date;
		if (event?.reminders_enabled) {
			request.reminder_date = subtractHours(event.reminder_date, request.start_time);
		}

		return request;
	};

	const handleCloseDialog = () => {
		clearFields();
		onCloseDialog();
	};

	return (
		<StyledDialog open={open} onCloseDialog={handleCloseDialog} title="New event" size="2xl">
			<EventBasicDetails event={event} onFieldChange={handleFieldChange} />
			<EventAdvancedOptions
				event={event}
				onFieldChange={handleFieldChange}
				onMembersLoaded={handleMembersLoaded}
				members={members}
			/>
			<Button full onClick={handleSave} disabled={!isValid()} loading={loading}>
				Add event
			</Button>
		</StyledDialog>
	);
}
