import Button from '../components/Button';
import { Link } from 'react-router-dom';
import NotificationSettingsList from '../components/NotificationSettingsList';
import PageLoading from '../components/PageLoading';
import PageTitle from '../components/PageTitle';
import { reportError } from '../utils/error';
import settingsApi from '../api/settingsApi';
import { useEffect } from 'react';
import { useState } from 'react';
import Icon from '../components/Icon';
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
    <div className="max-w-4xl mx-auto">
      <Link to="/account">
        <Button variant="open" color="gray">
          <div className="flex-center">
            <Icon name="arrow_back" className="w-4 h-4 mr-4" />
            Menu
          </div>
        </Button>
      </Link>
      <PageTitle title="Notification settings" />
      <p className="mb-4 leading-relaxed lg:px-2">
        You can configure the way you receive notifications below. Each type of
        notification can be customized, meaning you can opt to receive event
        reminders through text messages while receiving other notifications
        through email.
      </p>
      <NotificationSettingsList
        settings={settings}
        onSettingChanged={handleSettingChanged}
      />
    </div>
  );
}
