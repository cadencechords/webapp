import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import axios from 'axios';
import type { CurrentTeamResponse, Id, Membership, Team } from '../types';

const TEAMS_URL = import.meta.env.REACT_APP_API_URL + '/teams';

export interface TeamUpdates {
  name?: string;
  join_link_enabled?: boolean;
}

export default class TeamApi {
  static getAll() {
    return axios.get<Team[]>(import.meta.env.REACT_APP_API_URL + '/teams', {
      headers: constructAuthHeaders(),
    });
  }

  static createOne(newTeam: { name: string; plan?: string }) {
    const teamParams = { name: newTeam.name, plan: newTeam.plan };

    return axios.post<Team>(
      import.meta.env.REACT_APP_API_URL + '/teams',
      teamParams,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static getCurrentTeam() {
    return axios.get<CurrentTeamResponse>(`${TEAMS_URL}/${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static getMemberships() {
    return axios.get<Membership[]>(`${TEAMS_URL}/${getTeamId()}/memberships`, {
      headers: constructAuthHeaders(),
    });
  }

  static update(updates: TeamUpdates) {
    return axios.put<Team>(`${TEAMS_URL}/${getTeamId()}`, updates, {
      headers: constructAuthHeaders(),
    });
  }

  /** Without an id (no preset selected), JSON drops format_preset_id. */
  static setDefaultFormat(formatPresetId: Id | undefined) {
    return axios.post<unknown>(
      `${TEAMS_URL}/${getTeamId()}/default_format`,
      { format_preset_id: formatPresetId },
      { headers: constructAuthHeaders() }
    );
  }
}
