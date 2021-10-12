import Label from "./Label";
import ReminderTimesListBox from "../ReminderTimesListBox";
import Toggle from "./Toggle";

export default function EventReminders({ event, onFieldChange }) {
	return (
		<div>
			<Label>Reminders</Label>
			<div className="flex items-center gap-2 mb-4">
				Remind members?
				<Toggle
					onChange={(toggleValue) => onFieldChange("reminders_enabled", toggleValue)}
					enabled={event.reminders_enabled}
				/>
			</div>
			{event.reminders_enabled && (
				<div className="mb-4">
					Send reminder
					<ReminderTimesListBox
						onChange={(value) => onFieldChange("reminder_date", value)}
						selectedTime={event.reminder_date}
					/>
				</div>
			)}
		</div>
	);
}
