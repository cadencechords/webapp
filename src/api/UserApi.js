import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";
import axios from "axios";
import FileApi from "./FileApi";

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

	static getTeamMembership() {
		return axios.get(`${USERS_URL}/me/memberships?team_id=${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}

	static getMember(id) {
		return axios.get(`${USERS_URL}/${id}/memberships/${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}

	static updateMembership(userId, updates) {
		if (updates && userId) {
			let allowedParams = {};

			if ("isAdmin" in updates) allowedParams.is_admin = updates.isAdmin;
			if ("position" in updates) allowedParams.position = updates.position;

			console.log(updates, allowedParams);

			return axios.put(`${USERS_URL}/${userId}/memberships/${getTeamId()}`, allowedParams, {
				headers: constructAuthHeaders(),
			});
		}
	}

	static deleteMembership(userId) {
		return axios.delete(`${USERS_URL}/${userId}/memberships/${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}

	static addImageToUser(image) {
		return FileApi.addImageToUser(image);
	}

	static removeImageFromUser() {}
}
