export default class SettingsApi {
  static getNotificationSettings() {
    let settings = localStorage.getItem("notification_settings");

    if (!settings) {
      setDefaultNotificationSettings();
      settings = localStorage.getItem("notification_settings");
    }

    settings = JSON.parse(settings);

    return { data: settings };
  }

  static updateNotificationSetting(id, updates) {
    let parsedId = parseInt(id);
    let { data: settings } = this.getNotificationSettings();
    let setting = settings.find((s) => s.id === parsedId);
    setting = { ...setting, ...updates, updated_at: new Date() };

    this.setSettingInStorage(setting);

    return { data: setting };
  }

  static setAllSettingsInStorage(settings) {
    let stringified = JSON.stringify(settings);
    localStorage.setItem("notification_settings", stringified);
  }

  static setSettingInStorage(setting) {
    let { data: settings } = this.getNotificationSettings();
    settings = settings.map((s) => (s.id === setting.id ? setting : s));
    this.setAllSettingsInStorage(settings);
  }
}

function setDefaultNotificationSettings() {
  localStorage.setItem(
    "notification_settings",
    JSON.stringify([
      {
        created_at: "2022-02-01T00:03:47.189Z",
        updated_at: "2022-02-01T00:03:47.189Z",
        email_enabled: true,
        id: 1,
        notification_type: "Event reminder",
        push_enabled: false,
        sms_enabled: false,
        user_id: 1,
      },
    ])
  );
}
