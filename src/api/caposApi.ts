import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import api from './api';
import type { Capo, Id } from '../types';

export default class CaposApi {
  static create(capo: string, songId: Id) {
    return api().post<Capo>(
      `/songs/${songId}/capos?team_id=${getTeamId()}`,
      { capo_key: capo },
      { headers: constructAuthHeaders() }
    );
  }

  static update(capoId: Id, songId: Id, updates: Partial<Omit<Capo, 'id'>>) {
    return api().put<Capo>(
      `/songs/${songId}/capos/${capoId}?team_id=${getTeamId()}`,
      updates,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static delete(capoId: Id, songId: Id) {
    return api().delete<unknown>(
      `/songs/${songId}/capos/${capoId}?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
