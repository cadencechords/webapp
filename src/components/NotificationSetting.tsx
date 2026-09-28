import Toggle from './Toggle';
import { reportError } from '../utils/error';
import settingsApi from '../api/settingsApi';
import SectionTitle from './SectionTitle';
import { SettingsRowText } from './settings/SettingsRow';
import { LIST_ITEM_INTERACTIVE, LIST_ITEM_TWO_LINE } from './lists/listItem';
import type { OutlinedIconName } from './icons/registry';
import type { NotificationSetting as NotificationSettingModel } from '../types';

type NotificationSettingProps = {
  onChange: (setting: NotificationSettingModel) => void;
  /**
   * Undefined when the API returned no setting of this type. The toggles still
   * render (off); toggling one throws, as it always has.
   */
  setting: NotificationSettingModel | undefined;
};

// Text messages are no longer sent, so there's no sms_enabled switch.
type Channel = 'email_enabled' | 'push_enabled';

const CHANNELS: {
  field: Channel;
  icon: OutlinedIconName;
  title: string;
  description: string;
}[] = [
  {
    field: 'email_enabled',
    icon: 'mail',
    title: 'Email',
    description: 'To your account’s email address',
  },
  {
    field: 'push_enabled',
    icon: 'mobile',
    title: 'App (Push)',
    description: 'On devices with the app installed',
  },
];

// One kind of notification: its title, then a segmented list with a row per
// channel. Clicking anywhere on a row toggles its switch.
export default function NotificationSetting({
  onChange,
  setting,
}: NotificationSettingProps) {
  function handleToggle(field: Channel) {
    // Non-null (both): as before, reading the setting throws when there's
    // none (see the props), so onChange is never called without one.
    const newValue = !setting![field];
    onChange({ ...setting!, [field]: newValue });
    sendUpdateRequest({ [field]: newValue });
  }

  async function sendUpdateRequest(
    updates: Partial<Omit<NotificationSettingModel, 'id'>>
  ) {
    try {
      // Non-null: only handleToggle calls this, after reading the setting
      // (which throws when there's none).
      await settingsApi.updateNotificationSetting(setting!.id, updates);
    } catch (error) {
      reportError(error);
    }
  }

  return (
    <section>
      <SectionTitle title={setting?.notification_type} />
      <div className="list-segmented">
        {CHANNELS.map(({ field, icon, title, description }) => (
          <Toggle
            key={field}
            enabled={setting?.[field]}
            onChange={() => handleToggle(field)}
            className={`${LIST_ITEM_TWO_LINE} ${LIST_ITEM_INTERACTIVE}`}
            labelClassName="flex items-center flex-1 min-w-0 gap-4 cursor-pointer"
            label={
              <SettingsRowText
                icon={icon}
                title={title}
                description={description}
              />
            }
          />
        ))}
      </div>
    </section>
  );
}
