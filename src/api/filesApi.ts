import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import api from './api';
import type { Id, SongFile } from '../types';

export default class FilesApi {
  static addFilesToSong(songId: Id, files: Blob[]) {
    const formData = new FormData();
    files.forEach(file => formData.append('files[]', file));

    return api().post<SongFile[]>(
      `/songs/${songId}/files?team_id=${getTeamId()}`,
      formData,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static getFilesForSong(songId: Id) {
    return api().get<SongFile[]>(
      `/songs/${songId}/files?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static deleteSongFile(songId: Id, fileId: Id) {
    return api().delete<unknown>(
      `/songs/${songId}/files/${fileId}?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static updateSongFile(songId: Id, fileId: Id, updates: { name?: string }) {
    return api().put<SongFile>(
      `/songs/${songId}/files/${fileId}?team_id=${getTeamId()}`,
      updates,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
