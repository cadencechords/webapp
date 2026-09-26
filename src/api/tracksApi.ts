import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import api from './api';
import type { Id, Track } from '../types';

/** An Apple Music catalog song (only the fields the app reads). */
export interface AppleMusicSong {
  id: string;
  attributes?: {
    name?: string;
    artistName?: string;
    url?: string;
    /** `url` has `{w}` and `{h}` placeholders. */
    artwork?: { url?: string };
  };
}

export interface AppleMusicSearchResponse {
  results?: { songs?: { data?: AppleMusicSong[] } };
}

/** A Spotify track (only the fields the app reads). */
export interface SpotifyTrack {
  id: string;
  name?: string;
  artists?: { name: string }[];
  album?: { images?: { url?: string }[] };
  external_urls?: { spotify?: string };
}

export interface SpotifySearchResponse {
  tracks?: { items?: SpotifyTrack[] };
}

/** A YouTube search result (only the fields the app reads). */
export interface YouTubeVideo {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    channelTitle?: string;
    thumbnails?: {
      standard?: { url?: string };
      default?: { url?: string };
    };
  };
}

export interface YouTubeSearchResponse {
  items?: YouTubeVideo[];
}

export default class TracksApi {
  static deleteOne(songId: Id, trackId: Id) {
    return api().delete<unknown>(
      `/songs/${songId}/tracks/${trackId}?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static searchAppleMusic(query: string) {
    return api().get<AppleMusicSearchResponse>(
      `/apple_music/search?query=${query}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static searchSpotify(query: string) {
    return api().get<SpotifySearchResponse>(`/spotify/search?query=${query}`, {
      headers: constructAuthHeaders(),
    });
  }

  static searchYoutube(query: string) {
    return api().get<YouTubeSearchResponse>(`/youtube/search?query=${query}`, {
      headers: constructAuthHeaders(),
    });
  }

  static createBulk(tracks: Partial<Track>[], songId: Id) {
    return api().post<Track[]>(
      `/songs/${songId}/tracks?team_id=${getTeamId()}`,
      tracks,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
