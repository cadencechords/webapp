import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';
import axios from 'axios';
import { combineParamValues } from '../utils/ObjectUtils';
import type { Id, Setlist, Song } from '../types';

const SETLISTS_URL = import.meta.env.REACT_APP_API_URL + '/setlists';

export interface NewSetlist {
  name?: string;
  /** Sent as is; axios serializes a `Date` to an ISO string. */
  scheduledDate?: Date | string;
  shouldAddToCalendar?: boolean;
}

export interface SetlistUpdates {
  name?: string;
  /** Sent as is; axios serializes a `Date` to an ISO string. */
  scheduledDate?: Date | string;
  publicLinkEnabled?: boolean;
}

export default class SetlistApi {
  static search(name: string) {
    return axios.get<Setlist[]>(
      `${SETLISTS_URL}?team_id=${getTeamId()}&name=${name}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static getAll() {
    return axios.get<Setlist[]>(SETLISTS_URL + `?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static getOne(setlistId: Id) {
    return axios.get<Setlist>(
      SETLISTS_URL + `/${setlistId}?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static createOne(newSetlist: NewSetlist) {
    if (newSetlist) {
      const allowedParams: {
        name?: string;
        scheduled_date?: Date | string;
        should_add_to_calendar?: boolean;
        team_id?: Id | null;
      } = {};

      if (newSetlist.name) allowedParams.name = newSetlist.name;
      if (newSetlist.scheduledDate)
        allowedParams.scheduled_date = newSetlist.scheduledDate;
      if (newSetlist.shouldAddToCalendar)
        allowedParams.should_add_to_calendar = newSetlist.shouldAddToCalendar;

      allowedParams.team_id = getTeamId();

      return axios.post<Setlist>(SETLISTS_URL, allowedParams, {
        headers: constructAuthHeaders(),
      });
    }
  }

  /** Responds with the songs added (SetlistDetailPage appends them). */
  static addSongs(setlistId: Id, songIds: Id[]) {
    if (songIds.length > 0) {
      return axios.post<Song[]>(
        SETLISTS_URL + `/${setlistId}/songs`,
        { song_ids: songIds, team_id: getTeamId() },
        { headers: constructAuthHeaders() }
      );
    }
  }

  static removeSongs(setlistId: Id, songIds: Id[]) {
    if (songIds.length > 0) {
      return axios.delete<unknown>(
        SETLISTS_URL +
          `/${setlistId}/songs?${combineParamValues(
            'song_ids[]=',
            songIds
          )}&team_id=${getTeamId()}`,
        { headers: constructAuthHeaders() }
      );
    }
  }

  static updateScheduledSong(
    updates: { position?: number | null },
    songId: Id,
    setlistId: Id
  ) {
    const allowedParams: { position?: number; team_id?: Id | null } = {};

    if (updates.position !== undefined && updates.position !== null)
      allowedParams.position = updates.position;

    allowedParams.team_id = getTeamId();

    return axios.put<unknown>(
      SETLISTS_URL + `/${setlistId}/songs/${songId}`,
      allowedParams,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static deleteOne(setlistId: Id) {
    return axios.delete<unknown>(
      SETLISTS_URL + `/${setlistId}?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static updateOne(updates: SetlistUpdates, setlistId: Id) {
    if (updates) {
      const allowedParams: {
        name?: string;
        scheduled_date?: Date | string;
        public_link_enabled?: boolean;
        team_id?: Id | null;
      } = {};

      if (updates.name) allowedParams.name = updates.name;
      if (updates.scheduledDate)
        allowedParams.scheduled_date = updates.scheduledDate;
      if ('publicLinkEnabled' in updates)
        allowedParams.public_link_enabled = updates.publicLinkEnabled;

      allowedParams.team_id = getTeamId();
      return axios.put<Setlist>(SETLISTS_URL + `/${setlistId}`, allowedParams, {
        headers: constructAuthHeaders(),
      });
    }
  }
}
