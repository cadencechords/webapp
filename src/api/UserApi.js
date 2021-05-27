import { constructAuthHeaders } from "../utils/AuthUtils";
import axios from "axios";

const USERS_URL = process.env.REACT_APP_API_URL + "/users";

export default class UserApi {
	static getCurrentUser() {
		return axios.get(`${USERS_URL}/me`, { headers: constructAuthHeaders() });
	}

	static updateCurrentUser(updates) {
		let allowedParams = {};

		if (updates.firstName) allowedParams.first_name = updates.firstName;
		if (updates.lastName) allowedParams.last_name = updates.lastName;

		return axios.put(`${USERS_URL}/me`, allowedParams, { headers: constructAuthHeaders() });
	}

	static addImageToUser() {}

	static removeImageFromUser() {}
}
