import Toggle from './Toggle';
import { noop } from '../utils/constants';
import { reportError } from '../utils/error';
import settingsApi from '../api/settingsApi';
import { useState } from 'react';
import Icon from './Icon';
import type { ReactNode } from 'react';
import type { NotificationSetting as NotificationSettingModel } from '../types';

type NotificationSettingProps = {
  onChange: (setting: NotificationSettingModel) => void;
  /**
   * Undefined when the API returned no setting of this type. The toggles still
   * render (off); toggling one throws, as it always has.
   */
  setting: NotificationSettingModel | undefined;
  icon?: ReactNode;
};

export default function NotificationSetting({
  onChange,
  setting,
  icon,
}: NotificationSettingProps) {
  const [open, setOpen] = useState(false);

  function handleToggleOpen() {
    setOpen(currentValue => !currentValue);
  }

  function handleToggleSms() {
    // Non-null (both): as before, reading the setting throws when there's
    // none (see the props), so onChange is never called without one.
    const newValue = !setting!.sms_enabled;
    onChange({ ...setting!, sms_enabled: newValue });
    sendUpdateRequest({ sms_enabled: newValue });
  }

  function handleToggleEmail() {
    // Non-null (both): as before, reading the setting throws when there's
    // none (see the props), so onChange is never called without one.
    const newValue = !setting!.email_enabled;
    onChange({ ...setting!, email_enabled: newValue });
    sendUpdateRequest({ email_enabled: newValue });
  }

  function handleTogglePush() {
    // Non-null (both): as before, reading the setting throws when there's
    // none (see the props), so onChange is never called without one.
    const newValue = !setting!.push_enabled;
    onChange({ ...setting!, push_enabled: newValue });
    sendUpdateRequest({ push_enabled: newValue });
  }

  async function sendUpdateRequest(
    updates: Partial<Omit<NotificationSettingModel, 'id'>>
  ) {
    try {
      // Non-null: only the toggle handlers call this, after reading the
      // setting (which throws when there's none).
      await settingsApi.updateNotificationSetting(setting!.id, updates);
    } catch (error) {
      reportError(error);
    }
  }

  return (
    <div>
      <div
        className="hover:bg-gray-100 dark:hover:bg-dark-gray-700 transition-colors rounded-md p-2 cursor-pointer"
        onClick={handleToggleOpen}
      >
        <div className="flex-between">
          <div className="font-semibold text-xl flex items-center gap-2">
            {icon} {setting?.notification_type}
          </div>
          <Icon
            name="keyboard_arrow_down"
            className={
              `w-4 h-4 text-gray-600 dark:text-dark-gray-200 transition-transform transform ` +
              ` ${open ? 'rotate-180' : ''}`
            }
          />
        </div>
      </div>
      <div className={`mt-2 transition-all ${open ? 'block' : 'hidden'}`}>
        <div
          className="hover:bg-gray-100 dark:hover:bg-dark-gray-700 transition-colors rounded-xs cursor-pointer p-2 flex-between border-b dark:border-dark-gray-600"
          onClick={handleToggleEmail}
        >
          <div className="flex items-center gap-2">
            <Icon
              name="mail"
              className="w-5 h-5 text-gray-700 dark:text-dark-gray-200"
            />
            Email
          </div>
          <Toggle enabled={setting?.email_enabled} onChange={noop} />
        </div>
        <div
          className="hover:bg-gray-100 dark:hover:bg-dark-gray-700 transition-colors rounded-xs cursor-pointer p-2 flex-between border-b dark:border-dark-gray-600"
          onClick={handleToggleSms}
        >
          <div className="flex items-center gap-2">
            <Icon
              name="chat"
              className="w-5 h-5 text-gray-700 dark:text-dark-gray-200"
            />{' '}
            Text message
          </div>
          <Toggle enabled={setting?.sms_enabled} onChange={noop} />
        </div>
        <div
          className="hover:bg-gray-100 dark:hover:bg-dark-gray-700 transition-colors rounded-xs cursor-pointer p-2 flex-between "
          onClick={handleTogglePush}
        >
          <div className="flex items-center gap-2">
            <Icon
              name="mobile"
              className="w-5 h-5 text-gray-700 dark:text-dark-gray-200"
            />{' '}
            App (Push)
          </div>
          <Toggle enabled={setting?.push_enabled} onChange={noop} />
        </div>
      </div>
    </div>
  );
}
