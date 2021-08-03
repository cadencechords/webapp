import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";
import axios from "axios";
const FORMATS_URL = process.env.REACT_APP_API_URL + "/formats";

export default class FormatApi {
	static updateOneById(id, updates) {
		return axios.put(`${FORMATS_URL}/${id}?team_id=${getTeamId()}`, updates, {
			headers: constructAuthHeaders(),
		});
	}

	static createOne(format) {
		return axios.post(`${FORMATS_URL}?team_id=${getTeamId()}`, format, {
			headers: constructAuthHeaders(),
		});
	}
}
