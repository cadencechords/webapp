import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import axios from 'axios';
import type { Team, User } from '../types';

const FILES_URL = import.meta.env.REACT_APP_API_URL + '/files';

export default class FileApi {
  static addImageToUser(image: Blob) {
    const formData = new FormData();
    formData.append('image', image);

    return axios.post<User>(`${FILES_URL}/users`, formData, {
      headers: constructAuthHeaders(),
    });
  }

  static addImageToTeam(image: Blob) {
    const formData = new FormData();
    formData.append('image', image);

    return axios.post<Team>(`${FILES_URL}/teams/${getTeamId()}`, formData, {
      headers: constructAuthHeaders(),
    });
  }

  static deleteUserImage() {
    return axios.delete<unknown>(`${FILES_URL}/users`, {
      headers: constructAuthHeaders(),
    });
  }

  static deleteTeamImage() {
    return axios.delete<unknown>(`${FILES_URL}/teams/${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }
}
