import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import axios from 'axios';

const TEAMS_URL = process.env.REACT_APP_API_URL + '/teams';
export default class TeamApi {
  static getAll() {
    return axios.get(process.env.REACT_APP_API_URL + '/teams', {
      headers: constructAuthHeaders(),
    });
  }

  static createOne(newTeam) {
    let teamParams = { name: newTeam.name, plan: newTeam.plan };

    return axios.post(process.env.REACT_APP_API_URL + '/teams', teamParams, {
      headers: constructAuthHeaders(),
    });
  }

  static getCurrentTeam() {
    return axios.get(`${TEAMS_URL}/${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static getMemberships() {
    return axios.get(`${TEAMS_URL}/${getTeamId()}/memberships`, {
      headers: constructAuthHeaders(),
    });
  }

  static update(updates) {
    return axios.put(`${TEAMS_URL}/${getTeamId()}`, updates, {
      headers: constructAuthHeaders(),
    });
  }

  static setDefaultFormat(formatPresetId) {
    return axios.post(
      `${TEAMS_URL}/${getTeamId()}/default_format`,
      { format_preset_id: formatPresetId },
      { headers: constructAuthHeaders() }
    );
  }
}
