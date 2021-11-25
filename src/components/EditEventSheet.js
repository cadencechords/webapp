import {
	combineDateAndTime,
	diffInHours,
	format,
	isSameDate,
	isValidTime,
	parseHours,
	parseMinutes,
	parsePeriod,
	subtractHours,
} from "../utils/date";

import Button from "./Button";
import EventAdvancedOptions from "./EventAdvancedOptions";
import EventsApi from "../api/eventsApi";
import Label from "./Label";
import OutlinedInput from "./inputs/OutlinedInput";
import TimeInput from "./inputs/TimeInput";
import { reportError } from "../utils/error";
import { useState } from "react";

export default function EditEventSheet({ event, onChangeSheet, onEventUpdated }) {
	const [members, setMembers] = useState();
	const [eventCopy, setEventCopy] = useState(() => ({
		...event,
		date: format(event.start_time, "YYYY-MM-DD"),
		start_time: format(event.start_time, "h:mm A"),
		end_time: format(event.end_time, "h:mm A"),
		members: [...event.memberships],
		reminder_date: diffInHours(event.start_time, event.reminder_date),
	}));

	const [loading, setLoading] = useState(false);

	const handleFieldChange = (field, value) => {
		console.log(field, value);
		setEventCopy((currentCopy) => ({ ...currentCopy, [field]: value }));
	};

	const handleMembersLoaded = (loadedMembers) => {
		setMembers(loadedMembers);
	};

	const handleSave = async () => {
		let updates = toUpdateRequest();

		try {
			setLoading(true);
			let { data } = await EventsApi.update(updates, event.id);
			onEventUpdated(data);
			handleChangeSheet();
		} catch (error) {
			reportError(error);
			setLoading(false);
		}
	};

	const isValid = () => {
		return hasBasicDetails() && hasValidTimes();
	};

	const hasBasicDetails = () => {
		return eventCopy?.title && eventCopy?.date;
	};

	const hasValidTimes = () => {
		if (eventCopy?.start_time && eventCopy?.end_time) {
			return isValidTime(eventCopy.start_time) && isValidTime(eventCopy.end_time);
		} else if (eventCopy?.start_time) {
			return isValidTime(eventCopy.start_time);
		} else if (eventCopy?.end_time) {
			return isValidTime(eventCopy.end_time);
		} else {
			return true;
		}
	};

	const toUpdateRequest = () => {
		let request = { ...eventCopy };

		delete request.members;
		if (eventCopy?.members) {
			request.membership_ids = eventCopy.members.map((member) => member.id);
		}

		delete request.date;
		delete request.start_time;
		delete request.end_time;

		request.start_time = combineDateAndTime(eventCopy.date, eventCopy.start_time);
		if (eventCopy?.end_time) {
			request.end_time = combineDateAndTime(eventCopy.date, eventCopy.end_time);
		}

		delete request.reminder_date;
		if (eventCopy?.reminders_enabled) {
			request.reminder_date = subtractHours(eventCopy.reminder_date, request.start_time).toDate();
		}

		let differences = {};
		differences.membership_ids = request.membership_ids;

		if (request.title !== event.title) differences.title = request.title;
		if (request.description !== event.description) differences.description = request.description;
		if (request.color !== event.color) differences.color = request.color;

		if (!isSameDate(request.start_time, new Date(event.start_time))) {
			differences.start_time = request.start_time;
		}
		if (!isSameDate(request.end_time, event.end_time)) differences.end_time = request.end_time;

		if (request.reminders_enabled !== event.reminders_enabled)
			differences.reminders_enabled = request.reminders_enabled;
		if (request.reminders_enabled && !isSameDate(request.reminder_date, event.reminder_date))
			differences.reminder_date = request.reminder_date;

		console.log(differences);
		return differences;
	};

	const handleChangeSheet = () => {
		onChangeSheet(null);
	};

	if (!eventCopy || !event) return null;

	return (
		<>
			<div className="sm:hidden font-semibold mb-5">Details</div>
			<Label>Title</Label>
			<OutlinedInput
				value={eventCopy.title}
				onChange={(value) => handleFieldChange("title", value)}
				placeholder="Title"
				className="mb-4"
			/>

			<Label>Description</Label>
			<OutlinedInput
				value={eventCopy.description}
				onChange={(value) => handleFieldChange("description", value)}
				placeholder="Description"
				className="mb-4"
			/>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="w-full">
					<Label>Date</Label>
					<OutlinedInput
						value={format(eventCopy.date, "YYYY-MM-DD")}
						onChange={(value) => handleFieldChange("date", value)}
						placeholder="Date"
						className="mb-2 h-10"
						type="date"
					/>
				</div>

				<div className="flex">
					<div className="w-full mr-4">
						<Label>Time</Label>
						<TimeInput
							onChange={(value) => handleFieldChange("start_time", value)}
							defaultHours={parseHours(event.start_time)}
							defaultMinutes={parseMinutes(event.start_time)}
							defaultPeriod={parsePeriod(event.start_time)}
						/>
					</div>
					<div className="w-full">
						<Label>End time</Label>
						<TimeInput
							className="w-full"
							onChange={(value) => handleFieldChange("end_time", value)}
							defaultHours={parseHours(event.end_time)}
							defaultMinutes={parseMinutes(event.end_time)}
							defaultPeriod={parsePeriod(event.end_time)}
						/>
					</div>
				</div>
			</div>
			<EventAdvancedOptions
				event={eventCopy}
				onFieldChange={handleFieldChange}
				onMembersLoaded={handleMembersLoaded}
				members={members}
			/>

			<div className="flex items-center justify-end mt-4">
				<Button
					variant="open"
					color="gray"
					className="mr-2"
					size="small"
					onClick={handleChangeSheet}
				>
					Cancel
				</Button>
				<Button size="small" disabled={!isValid()} onClick={handleSave} loading={loading}>
					Save
				</Button>
			</div>
		</>
	);
}
