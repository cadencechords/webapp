import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import api from './api';
import type { Id, ImportableTeam, Song } from '../types';

export default class ImportsApi {
  static import(songs: Blob[]) {
    if (songs) {
      const formData = new FormData();
      songs.forEach(song => formData.append('files[]', song));

      return api().post<unknown>(`/imports?team_id=${getTeamId()}`, formData, {
        headers: constructAuthHeaders(),
      });
    }
  }

  static getImportableTeams() {
    return api().get<ImportableTeam[]>(
      `/imports/teams?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static getImportableSongs(exportTeamId: Id) {
    return api().get<Song[]>(
      `/imports/teams/${exportTeamId}/songs?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static importSongsFromTeam(exportTeamId: Id, songIds: Id[]) {
    return api().post<unknown>(
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
