import api from './api';
import { constructAuthHeaders } from '../utils/AuthUtils';
import type { Id, NotificationSetting } from '../types';

export default class SettingsApi {
  static getNotificationSettings() {
    return api().get<NotificationSetting[]>('/users/me/notification_settings', {
      headers: constructAuthHeaders(),
    });
  }

  static updateNotificationSetting(
    id: Id,
    updates: Partial<Omit<NotificationSetting, 'id'>>
  ) {
    return api().put<NotificationSetting>(
      `/users/me/notification_settings/${id}`,
      updates,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
