import axios from "axios";

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

function constructAuthHeaders() {
	let headers = {
		"access-token": localStorage.getItem("access-token"),
		client: localStorage.getItem("client"),
		uid: localStorage.getItem("uid"),
	};

	return headers;
}
