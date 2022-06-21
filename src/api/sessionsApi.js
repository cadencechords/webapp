import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

import api from "./api";

export default class SessionsApi {
  static getActiveSessions(setlistId) {
    return api().get(`/setlists/${setlistId}/sessions?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static startSession(setlistId) {
    return api().post(
      `/setlists/${setlistId}/sessions?team_id=${getTeamId()}`,
      { status: "ACTIVE" },
      { headers: constructAuthHeaders() }
    );
  }

  static endSession(setlistId, sessionId) {
    return api().put(
      `/setlists/${setlistId}/sessions/${sessionId}?team_id=${getTeamId()}`,
      { status: "INACTIVE" },
      { headers: constructAuthHeaders() }
    );
  }
}
