import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import axios from 'axios';
import { combineParamValues } from '../utils/ObjectUtils';
import type { Binder, Id, Song } from '../types';

const BINDERS_URL = import.meta.env.REACT_APP_API_URL + '/binders';

export interface NewBinder {
  name?: string;
  description?: string;
  color?: string;
}

export interface BinderUpdates extends NewBinder {
  songs?: unknown;
}

export default class BinderApi {
  static search(name: string) {
    return axios.get<Binder[]>(
      `${BINDERS_URL}?team_id=${getTeamId()}&name=${name}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static getAll() {
    return axios.get<Binder[]>(BINDERS_URL + `?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static getOneById(binderId: Id) {
    return axios.get<Binder>(
      BINDERS_URL + `/${binderId}?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static createOne(newBinder: NewBinder) {
    const binderParams = {
      name: newBinder.name?.trim(),
      description: newBinder.description?.trim(),
      color: newBinder.color?.trim(),
      team_id: getTeamId(),
    };

    return axios.post<Binder>(BINDERS_URL, binderParams, {
      headers: constructAuthHeaders(),
    });
  }

  static updateOneById(binderId: Id, updates: BinderUpdates) {
    const allowedParams: BinderUpdates = {};

    if (updates.name) allowedParams.name = updates.name.trim();
    if (updates.color) allowedParams.color = updates.color.trim();
    if (updates.description)
      allowedParams.description = updates.description.trim();
    if (updates.songs) allowedParams.songs = updates.songs;

    return axios.put<Binder>(
      BINDERS_URL + `/${binderId}?team_id=${getTeamId()}`,
      allowedParams,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  /** Responds with the songs added (`useAddSongsToBinder` appends them). */
  static addSongs(binderId: Id, songIds: Id[]) {
    if (songIds.length > 0) {
      return axios.post<Song[]>(
        BINDERS_URL + `/${binderId}/songs`,
        { song_ids: songIds, team_id: getTeamId() },
        { headers: constructAuthHeaders() }
      );
    }
  }

  static removeSongs(binderId: Id, songIds: Id[]) {
    if (songIds.length > 0) {
      return axios.delete<unknown>(
        BINDERS_URL +
          `/${binderId}/songs?${combineParamValues('song_ids[]=', songIds)}&team_id=${getTeamId()}`,
        { headers: constructAuthHeaders() }
      );
    }
  }

  static deleteOneById(id: Id) {
    return axios.delete<unknown>(
      `${BINDERS_URL}/${id}?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
