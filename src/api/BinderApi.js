import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";
import axios from "axios";

const BINDERS_URL = process.env.REACT_APP_API_URL + "/binders";

export default class BinderApi {
	static getAll() {
		return axios.get(BINDERS_URL + `?team_id=${getTeamId()}`, { headers: constructAuthHeaders() });
	}

	static getOneById(binderId) {
		return axios.get(BINDERS_URL + `/${binderId}?team_id=${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}

	static createOne(newBinder) {
		let binderParams = {
			name: newBinder.name?.trim(),
			description: newBinder.description?.trim(),
			color: newBinder.color?.trim(),
			team_id: getTeamId(),
		};

		return axios.post(BINDERS_URL, binderParams, {
			headers: constructAuthHeaders(),
		});
	}

	static updateOneById(binderId, updates) {
		let allowedParams = {};

		if (updates.name) allowedParams.name = updates.name.trim();
		if (updates.color) allowedParams.color = updates.color.trim();
		if (updates.description) allowedParams.description = updates.description.trim();
		if (updates.songs) allowedParams.songs = updates.songs;

		return axios.put(BINDERS_URL + `/${binderId}?team_id=${getTeamId()}`, allowedParams, {
			headers: constructAuthHeaders(),
		});
	}
}
