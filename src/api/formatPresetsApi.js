import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';
import api from './api';

const BASE_URL = `${process.env.REACT_APP_API_URL}/format_presets`;

export default class FormatPresetsApi {
  static getAll() {
    return api().get(`${BASE_URL}?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }
}
