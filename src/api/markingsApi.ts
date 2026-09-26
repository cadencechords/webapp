import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import api from './api';
import type { Id, Marking } from '../types';

export default class MarkingsApi {
  static create(songId: Id, marking: Omit<Marking, 'id'>) {
    return api().post<Marking>(
      `/songs/${songId}/markings?team_id=${getTeamId()}`,
      marking,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static update(
    songId: Id,
    markingId: Id,
    updates: Partial<Omit<Marking, 'id'>>
  ) {
    return api().put<Marking>(
      `/songs/${songId}/markings/${markingId}?team_id=${getTeamId()}`,
      updates,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static delete(songId: Id, markingId: Id) {
    return api().delete<unknown>(
      `/songs/${songId}/markings/${markingId}?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
