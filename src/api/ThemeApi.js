import axios from "axios";
import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

const THEMES_URL = process.env.REACT_APP_API_URL + "/themes";

export default class ThemeApi {
	static createOne(newTheme) {
		let allowedParams = {
			name: newTheme.name,
			team_id: getTeamId(),
		};
		return axios.post(THEMES_URL, allowedParams, {
			headers: constructAuthHeaders(),
		});
	}

	static getAll() {
		return axios.get(THEMES_URL + `?team_id=${getTeamId()}`, { headers: constructAuthHeaders() });
	}
}
