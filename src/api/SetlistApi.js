import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';
import axios from 'axios';
import { combineParamValues } from '../utils/ObjectUtils';

const SETLISTS_URL = process.env.REACT_APP_API_URL + '/setlists';

export default class SetlistApi {
  static search(name) {
    return axios.get(`${SETLISTS_URL}?team_id=${getTeamId()}&name=${name}`, {
      headers: constructAuthHeaders(),
    });
  }

  static getAll() {
    return axios.get(SETLISTS_URL + `?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static getOne(setlistId) {
    return axios.get(SETLISTS_URL + `/${setlistId}?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static createOne(newSetlist) {
    if (newSetlist) {
      let allowedParams = {};

      if (newSetlist.name) allowedParams.name = newSetlist.name;
      if (newSetlist.scheduledDate)
        allowedParams.scheduled_date = newSetlist.scheduledDate;
      if (newSetlist.shouldAddToCalendar)
        allowedParams.should_add_to_calendar = newSetlist.shouldAddToCalendar;

      allowedParams.team_id = getTeamId();

      return axios.post(SETLISTS_URL, allowedParams, {
        headers: constructAuthHeaders(),
      });
    }
  }

  static addSongs(setlistId, songIds) {
    if (songIds.length > 0) {
      return axios.post(
        SETLISTS_URL + `/${setlistId}/songs`,
        { song_ids: songIds, team_id: getTeamId() },
        { headers: constructAuthHeaders() }
      );
    }
  }

  static removeSongs(setlistId, songIds) {
    if (songIds.length > 0) {
      return axios.delete(
        SETLISTS_URL +
          `/${setlistId}/songs?${combineParamValues(
            'song_ids[]=',
            songIds
          )}&team_id=${getTeamId()}`,
        { headers: constructAuthHeaders() }
      );
    }
  }

  static updateScheduledSong(updates, songId, setlistId) {
    let allowedParams = {};

    if (updates.position !== undefined && updates.position !== null)
      allowedParams.position = updates.position;

    allowedParams.team_id = getTeamId();

    return axios.put(
      SETLISTS_URL + `/${setlistId}/songs/${songId}`,
      allowedParams,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static deleteOne(setlistId) {
    return axios.delete(SETLISTS_URL + `/${setlistId}?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static updateOne(updates, setlistId) {
    if (updates) {
      let allowedParams = {};

      if (updates.name) allowedParams.name = updates.name;
      if (updates.scheduledDate)
        allowedParams.scheduled_date = updates.scheduledDate;
      if ('publicLinkEnabled' in updates)
        allowedParams.public_link_enabled = updates.publicLinkEnabled;

      allowedParams.team_id = getTeamId();
      return axios.put(SETLISTS_URL + `/${setlistId}`, allowedParams, {
        headers: constructAuthHeaders(),
      });
    }
  }
}
