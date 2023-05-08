import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';
import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_URL}/songs`;

export default class FormatApi {
  static updateSongFormat(songId, updates) {
    return axios.put(
      `${BASE_URL}/${songId}/format?team_id=${getTeamId()}`,
      updates,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
