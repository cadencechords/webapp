import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';
import api from './api';
import type { FormatPreset } from '../types';

const BASE_URL = `${import.meta.env.REACT_APP_API_URL}/format_presets`;

export default class FormatPresetsApi {
  static getAll() {
    return api().get<FormatPreset[]>(`${BASE_URL}?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }
}
