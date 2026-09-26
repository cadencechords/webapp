import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import api from './api';
import type { Id, SongNote } from '../types';

export default class NotesApi {
  static getAll(songId: Id) {
    return api().get<SongNote[]>(
      `/songs/${songId}/notes?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  /** The presenter pages leave out `note` and post no body. */
  static create(songId: Id, note?: Partial<Omit<SongNote, 'id'>>) {
    return api().post<SongNote>(
      `/songs/${songId}/notes?team_id=${getTeamId()}`,
      note,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static update(
    songId: Id,
    noteId: Id,
    updates: Partial<Omit<SongNote, 'id'>>
  ) {
    return api().put<SongNote>(
      `/songs/${songId}/notes/${noteId}?team_id=${getTeamId()}`,
      updates,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static delete(songId: Id, noteId: Id) {
    return api().delete<unknown>(
      `/songs/${songId}/notes/${noteId}?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
