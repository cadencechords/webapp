import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';
import axios from 'axios';
import type { Id, PcoSong } from '../types';

const PCO_URL = import.meta.env.REACT_APP_API_URL + '/pco';
const NUMBER_PER_PAGE = 25;

export default class PlanningCenterApi {
  static authorize(code: string) {
    return axios.post<unknown>(
      PCO_URL + '/auth',
      { code, team_id: getTeamId() },
      { headers: constructAuthHeaders() }
    );
  }

  static getSongs(pageNumber: number, query?: string) {
    const offset = NUMBER_PER_PAGE * pageNumber;
    return axios.get<PcoSong[]>(
      `${PCO_URL}/songs?offset=${offset}${query ? '&query=' + query : ''}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static importSongs(songIds: Id[]) {
    return axios.post<unknown>(
      PCO_URL + '/songs',
      { songs: songIds, team_id: getTeamId() },
      { headers: constructAuthHeaders() }
    );
  }

  static disconnect() {
    return axios.delete<unknown>(PCO_URL + '/users/me', {
      headers: constructAuthHeaders(),
    });
  }
}
