import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import api from './api';

export default class ImportsApi {
  static import(songs) {
    if (songs) {
      let formData = new FormData();
      songs.forEach(song => formData.append('files[]', song));

      return api().post(`/imports?team_id=${getTeamId()}`, formData, {
        headers: constructAuthHeaders(),
      });
    }
  }

  static getImportableTeams() {
    return api().get(`/imports/teams?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static getImportableSongs(exportTeamId) {
    return api().get(
      `/imports/teams/${exportTeamId}/songs?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static importSongsFromTeam(exportTeamId, songIds) {
    return api().post(
      `/imports/teams/${exportTeamId}/songs?team_id=${getTeamId()}`,
      {
        song_ids: songIds,
      },
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
