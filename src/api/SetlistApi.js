import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";
import axios from "axios";

const SETLISTS_URL = process.env.REACT_APP_API_URL + "/setlists";

export default class SetlistApi {
	static getAll() {
		return axios.get(SETLISTS_URL + `?team_id=${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}

	static createOne(newSetlist) {
		if (newSetlist) {
			let allowedParams = {};

			if (newSetlist.name) allowedParams.name = newSetlist.name;
			if (newSetlist.scheduledDate) allowedParams.scheduled_date = newSetlist.scheduledDate;

			allowedParams.team_id = getTeamId();

			return axios.post(SETLISTS_URL, allowedParams, { headers: constructAuthHeaders() });
		}
	}
}
