import ChatIcon from "@heroicons/react/outline/ChatIcon";
import ChevronDownIcon from "@heroicons/react/outline/ChevronDownIcon";
import DeviceMobileIcon from "@heroicons/react/outline/DeviceMobileIcon";
import MailIcon from "@heroicons/react/outline/MailIcon";
import Toggle from "./Toggle";
import { noop } from "../utils/constants";
import settingsApi from "../api/settingsApi";
import { useState } from "react";

export default function NotificationSetting({ onChange, setting, icon }) {
  const [open, setOpen] = useState(false);

  function handleToggleOpen() {
    setOpen((currentValue) => !currentValue);
  }

  function handleToggleSms() {
    let newValue = !setting.sms_enabled;
    onChange({ ...setting, sms_enabled: newValue });
    sendUpdateRequest({ sms_enabled: newValue });
  }

  function handleToggleEmail() {
    let newValue = !setting.email_enabled;
    onChange({ ...setting, email_enabled: newValue });
    sendUpdateRequest({ email_enabled: newValue });
  }

  function handleTogglePush() {
    let newValue = !setting.push_enabled;
    onChange({ ...setting, push_enabled: newValue });
    sendUpdateRequest({ push_enabled: newValue });
  }

  function sendUpdateRequest(updates) {
    settingsApi.updateNotificationSetting(setting.id, updates);
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
          <ChevronDownIcon
            className={
              `w-4 h-4 text-gray-600 dark:text-dark-gray-200 transition-transform transform ` +
              ` ${open ? "rotate-180" : ""}`
            }
          />
        </div>
      </div>
      <div className={`mt-2 transition-all ${open ? "block" : "hidden"}`}>
        <div
          className="hover:bg-gray-100 dark:hover:bg-dark-gray-700 transition-colors rounded-sm cursor-pointer p-2 flex-between border-b dark:border-dark-gray-600"
          onClick={handleToggleEmail}
        >
          <div className="flex items-center gap-2">
            <MailIcon className="w-5 h-5 text-gray-700 dark:text-dark-gray-200" />
            Email
          </div>
          <Toggle enabled={setting?.email_enabled} onChange={noop} />
        </div>
        <div
          className="hover:bg-gray-100 dark:hover:bg-dark-gray-700 transition-colors rounded-sm cursor-pointer p-2 flex-between border-b dark:border-dark-gray-600"
          onClick={handleToggleSms}
        >
          <div className="flex items-center gap-2">
            <ChatIcon className="w-5 h-5 text-gray-700 dark:text-dark-gray-200" />{" "}
            Text message
          </div>
          <Toggle enabled={setting?.sms_enabled} onChange={noop} />
        </div>
        <div
          className="hover:bg-gray-100 dark:hover:bg-dark-gray-700 transition-colors rounded-sm cursor-pointer p-2 flex-between "
          onClick={handleTogglePush}
        >
          <div className="flex items-center gap-2">
            <DeviceMobileIcon className="w-5 h-5 text-gray-700 dark:text-dark-gray-200" />{" "}
            App (Push)
          </div>
          <Toggle enabled={setting?.push_enabled} onChange={noop} />
        </div>
      </div>
    </div>
  );
}
