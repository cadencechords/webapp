import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import api from './api';
import type { Id, Session } from '../types';

export default class SessionsApi {
  static getActiveSessions(setlistId: Id) {
    return api().get<Session[]>(
      `/setlists/${setlistId}/sessions?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static startSession(setlistId: Id) {
    return api().post<Session>(
      `/setlists/${setlistId}/sessions?team_id=${getTeamId()}`,
      { status: 'ACTIVE' },
      { headers: constructAuthHeaders() }
    );
  }

  static endSession(setlistId: Id, sessionId: Id) {
    return api().put<Session>(
      `/setlists/${setlistId}/sessions/${sessionId}?team_id=${getTeamId()}`,
      { status: 'INACTIVE' },
      { headers: constructAuthHeaders() }
    );
  }
}
