import axios from "axios";
import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

const TEAMS_URL = process.env.REACT_APP_API_URL + "/teams";
export default class TeamApi {
	static getAll() {
		return axios.get(process.env.REACT_APP_API_URL + "/teams", {
			headers: constructAuthHeaders(),
		});
	}

	static createOne(newTeam) {
		let teamParams = { name: newTeam.name };

		return axios.post(process.env.REACT_APP_API_URL + "/teams", teamParams, {
			headers: constructAuthHeaders(),
		});
	}

	static getCurrentTeam() {
		return axios.get(`${TEAMS_URL}/${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}
}
