import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import axios from 'axios';
import type { Id, OnsongBackup, OnsongFile } from '../types';

const ONSONG_URL = import.meta.env.REACT_APP_API_URL + '/onsong';

export default class OnsongApi {
  static unzip(file: Blob) {
    const formData = new FormData();
    formData.append('backup', file);
    return axios.post<OnsongBackup>(
      `${ONSONG_URL}/unzip?team_id=${getTeamId()}`,
      formData,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static import(songs: OnsongFile[], binderId: Id | undefined, importId: Id) {
    const importParams: { songs: OnsongFile[]; binder_id?: Id } = {
      songs,
    };

    if (binderId) {
      importParams.binder_id = binderId;
    }

    return axios.post<unknown>(
      `${ONSONG_URL}/import/${importId}?team_id=${getTeamId()}`,
      importParams,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
