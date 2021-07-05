import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";
import { combineParamValues } from "../utils/ObjectUtils";
import axios from "axios";

const SONGS_URL = process.env.REACT_APP_API_URL + "/songs";

export default class SongApi {
	static search(name) {
		return axios.get(`${SONGS_URL}?team_id=${getTeamId()}&name=${name}`, {
			headers: constructAuthHeaders(),
		});
	}

	static getAll() {
		return axios.get(SONGS_URL + `?team_id=${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}

	static createOne(newSong) {
		let songParams = {
			name: newSong.name,
			team_id: getTeamId(),
		};

		return axios.post(SONGS_URL, songParams, { headers: constructAuthHeaders() });
	}

	static getOneById(songId) {
		return axios.get(SONGS_URL + `/${songId}?team_id=${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}

	static updateOneById(songId, updates) {
		let allowedParams = {};

		if (updates.name) allowedParams.name = updates.name;
		if (updates.bpm) allowedParams.bpm = updates.bpm;
		if (updates.artist) allowedParams.artist = updates.artist;
		if (updates.meter) allowedParams.meter = updates.meter;
		if (updates.key) allowedParams.key = updates.key;
		if (updates.content) allowedParams.content = updates.content;
		if (updates.font) allowedParams.font = updates.font;
		if (updates.fontSize) allowedParams.font_size = Number.parseInt(updates.fontSize);
		if ("boldChords" in updates) allowedParams.bold_chords = updates.boldChords;
		if ("italicChords" in updates) allowedParams.italic_chords = updates.italicChords;

		return axios.put(SONGS_URL + `/${songId}?team_id=${getTeamId()}`, allowedParams, {
			headers: constructAuthHeaders(),
		});
	}

	static addThemes(songId, themeIds) {
		if (themeIds.length > 0) {
			return axios.post(
				SONGS_URL + `/${songId}/themes`,
				{ theme_ids: themeIds, team_id: getTeamId() },
				{ headers: constructAuthHeaders() }
			);
		}
	}

	static removeThemes(songId, themeIds) {
		if (themeIds?.length > 0) {
			return axios.delete(
				SONGS_URL +
					`/${songId}/themes?${combineParamValues(
						"theme_ids[]=",
						themeIds
					)}&team_id=${getTeamId()}`,
				{ headers: constructAuthHeaders() }
			);
		}
	}

	static addGenres(songId, genreIds) {
		if (genreIds.length > 0) {
			return axios.post(
				SONGS_URL + `/${songId}/genres`,
				{ genre_ids: genreIds, team_id: getTeamId() },
				{ headers: constructAuthHeaders() }
			);
		}
	}

	static removeGenres(songId, genreIds) {
		if (genreIds?.length > 0) {
			return axios.delete(
				SONGS_URL +
					`/${songId}/genres?${combineParamValues(
						"genre_ids[]=",
						genreIds
					)}&team_id=${getTeamId()}`,
				{ headers: constructAuthHeaders() }
			);
		}
	}
}
