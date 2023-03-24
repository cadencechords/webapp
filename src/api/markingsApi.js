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
}
