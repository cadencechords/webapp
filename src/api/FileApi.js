import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

import axios from "axios";

const FILES_URL = process.env.REACT_APP_API_URL + "/files";

export default class FileApi {
	static addImageToUser(image) {
		let formData = new FormData();
		formData.append("image", image);

		return axios.post(`${FILES_URL}/users`, formData, {
			headers: constructAuthHeaders(),
		});
	}

	static addImageToTeam(image) {
		let formData = new FormData();
		formData.append("image", image);

		return axios.post(`${FILES_URL}/teams/${getTeamId()}`, formData, {
			headers: constructAuthHeaders(),
		});
	}

	static deleteUserImage() {
		return axios.delete(`${FILES_URL}/users`, {
			headers: constructAuthHeaders(),
		});
	}

	static deleteTeamImage() {
		return axios.delete(`${FILES_URL}/teams/${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}
}
