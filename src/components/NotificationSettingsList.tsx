import NotificationSetting from './NotificationSetting';
import Icon from './Icon';
import type { NotificationSetting as NotificationSettingModel } from '../types';

type NotificationSettingsListProps = {
  settings: NotificationSettingModel[];
  onSettingChanged: (setting: NotificationSettingModel) => void;
};

export default function NotificationSettingsList({
  settings,
  onSettingChanged,
}: NotificationSettingsListProps) {
  function getSetting(notificationType: string) {
    return settings.find(
      setting => setting.notification_type === notificationType
    );
  }

  return (
    <div className="border dark:border-dark-gray-600 rounded-md p-2">
      <NotificationSetting
        setting={getSetting('Event reminder')}
        icon={<Icon name="calendar_month" className="w-8 h-8" />}
        onChange={onSettingChanged}
      />
    </div>
  );
}
