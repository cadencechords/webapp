import { constructAuthHeaders } from '../utils/AuthUtils';
import api from './api';
import type { Team } from '../types';

export default class JoinLinkApi {
  static getByJoinLinkCode(code: string) {
    return api().get<Team>(`/join/${code}`);
  }

  static join(code: string) {
    return api().post<unknown>(
      `/join/${code}`,
      {},
      { headers: constructAuthHeaders() }
    );
  }
}
