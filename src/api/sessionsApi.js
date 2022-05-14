import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

import api from "./api";

export default class SessionsApi {
  static getActiveSessions(setlistId) {
    return api().get(`/setlists/${setlistId}/sessions?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }
}
