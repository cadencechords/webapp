import NotificationSettingsList from '../components/NotificationSettingsList';
import PageLoading from '../components/PageLoading';
import AccountPageHeader from '../components/settings/AccountPageHeader';
import { reportError } from '../utils/error';
import settingsApi from '../api/settingsApi';
import { useEffect } from 'react';
import { useState } from 'react';
import type { NotificationSetting } from '../types';

export default function AccountNotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Notification Settings';
    async function fetchData() {
      try {
        setLoading(true);
        const { data } = await settingsApi.getNotificationSettings();
        setSettings(data);
      } catch (error) {
        reportError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  function handleSettingChanged(updatedSetting: NotificationSetting) {
    setSettings(currentSettings => {
      return currentSettings.map(setting =>
        setting.id === updatedSetting.id ? updatedSetting : setting
      );
    });
  }

  if (loading) return <PageLoading />;

  return (
    <div className="max-w-2xl mx-auto font-plain">
      <AccountPageHeader title="Notifications" />
      <p className="mb-2 text-body-medium text-on-surface-variant">
        Choose how you get each kind of notification: by email, in the app, or
        both.
      </p>
      <NotificationSettingsList
        settings={settings}
        onSettingChanged={handleSettingChanged}
      />
    </div>
  );
}
