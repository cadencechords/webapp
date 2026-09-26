import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import axios from 'axios';
import { combineParamValues } from '../utils/ObjectUtils';
import type { Id, Song } from '../types';

const SONGS_URL = import.meta.env.REACT_APP_API_URL + '/songs';

export interface SongUpdates {
  name?: string;
  bpm?: number | string;
  artist?: string;
  meter?: string;
  original_key?: string;
  transposed_key?: string | null;
  content?: string;
  scroll_speed?: number;
  /** Section names, sent joined with `@`. */
  roadmap?: string[];
}

/** `SongUpdates` as sent, with the roadmap joined. */
type SongParams = Omit<SongUpdates, 'roadmap'> & { roadmap?: string };

export default class SongApi {
  static search(name: string) {
    return axios.get<Song[]>(
      `${SONGS_URL}?team_id=${getTeamId()}&name=${name}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static getAll() {
    return axios.get<Song[]>(SONGS_URL + `?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static createOne(newSong: { name: string }) {
    const songParams = {
      name: newSong.name,
      team_id: getTeamId(),
    };

    return axios.post<Song>(SONGS_URL, songParams, {
      headers: constructAuthHeaders(),
    });
  }

  static getOneById(songId: Id) {
    return axios.get<Song>(SONGS_URL + `/${songId}?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static updateOneById(songId: Id, updates: SongUpdates) {
    const allowedParams: SongParams = {};

    if (updates.name) allowedParams.name = updates.name;
    if (updates.bpm) allowedParams.bpm = updates.bpm;
    if (updates.artist) allowedParams.artist = updates.artist;
    if (updates.meter) allowedParams.meter = updates.meter;
    if (updates.original_key) allowedParams.original_key = updates.original_key;
    if ('transposed_key' in updates)
      allowedParams.transposed_key = updates.transposed_key;
    if ('content' in updates) allowedParams.content = updates.content;
    if (updates.scroll_speed) allowedParams.scroll_speed = updates.scroll_speed;
    if (updates.roadmap) allowedParams.roadmap = updates.roadmap.join('@');

    return axios.put<Song>(
      SONGS_URL + `/${songId}?team_id=${getTeamId()}`,
      allowedParams,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static addThemes(songId: Id, themeIds: Id[]) {
    if (themeIds.length > 0) {
      return axios.post<unknown>(
        SONGS_URL + `/${songId}/themes`,
        { theme_ids: themeIds, team_id: getTeamId() },
        { headers: constructAuthHeaders() }
      );
    }
  }

  static removeThemes(songId: Id, themeIds: Id[] | undefined) {
    if (themeIds && themeIds.length > 0) {
      return axios.delete<unknown>(
        SONGS_URL +
          `/${songId}/themes?${combineParamValues(
            'theme_ids[]=',
            themeIds
          )}&team_id=${getTeamId()}`,
        { headers: constructAuthHeaders() }
      );
    }
  }

  static addGenres(songId: Id, genreIds: Id[]) {
    if (genreIds.length > 0) {
      return axios.post<unknown>(
        SONGS_URL + `/${songId}/genres`,
        { genre_ids: genreIds, team_id: getTeamId() },
        { headers: constructAuthHeaders() }
      );
    }
  }

  static removeGenres(songId: Id, genreIds: Id[] | undefined) {
    if (genreIds && genreIds.length > 0) {
      return axios.delete<unknown>(
        SONGS_URL +
          `/${songId}/genres?${combineParamValues(
            'genre_ids[]=',
            genreIds
          )}&team_id=${getTeamId()}`,
        { headers: constructAuthHeaders() }
      );
    }
  }

  static deleteOneById(id: Id) {
    return axios.delete<unknown>(`${SONGS_URL}/${id}?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static deleteBulk(ids: Id[]) {
    return axios.delete<unknown>(
      `${SONGS_URL}?` +
        combineParamValues('ids[]=', ids) +
        `&team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
