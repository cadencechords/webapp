import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import api from './api';
import type { Setlist } from '../types';

export interface DashboardData {
  todays_setlists: Setlist[];
}

export default class DashboardApi {
  static getDashboardData() {
    return api().get<DashboardData>(`/dashboard?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }
}
