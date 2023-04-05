import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';
import axios from 'axios';

const PCO_URL = process.env.REACT_APP_API_URL + '/pco';
const NUMBER_PER_PAGE = 25;

export default class PlanningCenterApi {
  static authorize(code) {
    return axios.post(
      PCO_URL + '/auth',
      { code, team_id: getTeamId() },
      { headers: constructAuthHeaders() }
    );
  }

  static getSongs(pageNumber, query) {
    const offset = NUMBER_PER_PAGE * pageNumber;
    return axios.get(
      `${PCO_URL}/songs?offset=${offset}${query ? '&query=' + query : ''}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static importSongs(songIds) {
    return axios.post(
      PCO_URL + '/songs',
      { songs: songIds, team_id: getTeamId() },
      { headers: constructAuthHeaders() }
    );
  }

  static disconnect() {
    return axios.delete(PCO_URL + '/users/me', {
      headers: constructAuthHeaders(),
    });
  }
}
