import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import api from './api';

export default class MarkingsApi {
  static create(songId, marking) {
    return api().post(
      `/songs/${songId}/markings?team_id=${getTeamId()}`,
      marking,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static update(songId, markingId, updates) {
    return api().put(
      `/songs/${songId}/markings/${markingId}?team_id=${getTeamId()}`,
      updates,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static delete(songId, markingId) {
    return api().delete(
      `/songs/${songId}/markings/${markingId}?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
