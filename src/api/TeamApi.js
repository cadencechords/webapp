import axios from "axios";
import { constructAuthHeaders } from "../utils/AuthUtils";

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
}
