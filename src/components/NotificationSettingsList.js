import CalendarIcon from "@heroicons/react/outline/CalendarIcon";
import NotificationSetting from "./NotificationSetting";

export default function NotificationSettingsList({ settings, onSettingChanged }) {
	function getSetting(notificationType) {
		return settings.find((setting) => setting.notification_type === notificationType);
	}

	return (
		<div className="border rounded-md p-2">
			<NotificationSetting
				setting={getSetting("Event reminder")}
				icon={<CalendarIcon className="w-8 h-8" />}
				onChange={onSettingChanged}
			/>
		</div>
	);
}
