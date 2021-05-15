import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";
import { combineParamValues } from "../utils/ObjectUtils";
import axios from "axios";

const SONGS_URL = process.env.REACT_APP_API_URL + "/songs";

export default class SongApi {
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
}
