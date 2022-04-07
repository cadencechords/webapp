import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

import api from "./api";

export default class TracksApi {
  static deleteOne(songId, trackId) {
    return api().delete(
      `/songs/${songId}/tracks/${trackId}?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static searchAppleMusic(query) {
    return api().get(`/apple_music/search?query=${query}`, {
      headers: constructAuthHeaders(),
    });
  }

  static searchSpotify(query) {
    return api().get(`/spotify/search?query=${query}`, {
      headers: constructAuthHeaders(),
    });
  }

  static searchYoutube(query) {
    return api().get(`/youtube/search?query=${query}`, {
      headers: constructAuthHeaders(),
    });
  }

  static createBulk(tracks, songId) {
    return api().post(
      `/songs/${songId}/tracks?team_id=${getTeamId()}`,
      tracks,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
