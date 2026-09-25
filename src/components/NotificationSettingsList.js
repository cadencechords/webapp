import NotificationSetting from "./NotificationSetting";
import Icon from './Icon';

export default function NotificationSettingsList({ settings, onSettingChanged }) {
	function getSetting(notificationType) {
		return settings.find((setting) => setting.notification_type === notificationType);
	}

	return (
		<div className="border dark:border-dark-gray-600 rounded-md p-2">
			<NotificationSetting
				setting={getSetting("Event reminder")}
				icon={<Icon name="calendar_month" className="w-8 h-8" />}
				onChange={onSettingChanged}
			/>
		</div>
	);
}
