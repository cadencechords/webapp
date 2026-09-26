import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import api from './api';
import type { CalendarEvent, Id } from '../types';

/** An event as sent to the API (`fromEventForm`). */
export interface EventRequest {
  title?: string;
  description?: string;
  color?: string;
  reminders_enabled?: boolean;
  setlist_id?: Id | null;
  start_time?: Date | string;
  end_time?: Date | string | null;
  reminder_date?: Date | string | null;
  membership_ids?: Id[];
}

export default class EventsApi {
  static getAll() {
    return api().get<CalendarEvent[]>(`/events?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static get(id: Id) {
    return api().get<CalendarEvent>(`/events/${id}?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static create(event: EventRequest) {
    return api().post<CalendarEvent>(
      '/events',
      {
        ...event,
        team_id: getTeamId(),
      },
      { headers: constructAuthHeaders() }
    );
  }

  static delete(id: Id) {
    return api().delete<unknown>(`/events/${id}?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static update(updates: EventRequest, id: Id) {
    return api().put<CalendarEvent>(
      `/events/${id}?team_id=${getTeamId()}`,
      updates,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
