import axios from 'axios';
import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';
import type { Tag } from '../types';

const THEMES_URL = import.meta.env.REACT_APP_API_URL + '/themes';

export default class ThemeApi {
  static createOne(newTheme: { name: string }) {
    const allowedParams = {
      name: newTheme.name,
      team_id: getTeamId(),
    };
    return axios.post<Tag>(THEMES_URL, allowedParams, {
      headers: constructAuthHeaders(),
    });
  }

  static getAll() {
    return axios.get<Tag[]>(THEMES_URL + `?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }
}
