import NotificationSetting from './NotificationSetting';
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
    <NotificationSetting
      setting={getSetting('Event reminder')}
      onChange={onSettingChanged}
    />
  );
}
