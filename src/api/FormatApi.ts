import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';
import axios from 'axios';
import type { Id, SongFormat } from '../types';

const BASE_URL = `${import.meta.env.REACT_APP_API_URL}/songs`;

export default class FormatApi {
  static updateSongFormat(songId: Id, updates: Partial<SongFormat>) {
    return axios.put<SongFormat>(
      `${BASE_URL}/${songId}/format?team_id=${getTeamId()}`,
      updates,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
