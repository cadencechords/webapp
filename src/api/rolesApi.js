import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

import axios from "axios";

const ROLES_URL = process.env.REACT_APP_API_URL + "/roles";

export default class RolesApi {
	static getAll() {
		return axios.get(`${ROLES_URL}?team_id=${getTeamId()}`, { headers: constructAuthHeaders() });
	}

	static getOne(id) {
		return axios.get(`${ROLES_URL}/${id}?team_id=${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}

	static addPermission(roleId, permissionName) {
		return axios.post(
			`${ROLES_URL}/${roleId}/permissions?team_id=${getTeamId()}`,
			{ name: permissionName },
			{ headers: constructAuthHeaders() }
		);
	}

	static removePermission(roleId, permissionName) {
		return axios.delete(
			`${ROLES_URL}/${roleId}/permissions?name=${permissionName}&team_id=${getTeamId()}`,
			{
				headers: constructAuthHeaders(),
			}
		);
	}

	static updateOne(updates, roleId) {
		return axios.put(`${ROLES_URL}/${roleId}?team_id=${getTeamId()}`, updates, {
			headers: constructAuthHeaders(),
		});
	}

	static assignRoleBulk(memberIds, roleId) {
		return axios.post(
			`${ROLES_URL}/${roleId}/memberships?team_id=${getTeamId()}`,
			{ membership_ids: memberIds },
			{ headers: constructAuthHeaders() }
		);
	}

	static createOne(role) {
		return axios.post(`${ROLES_URL}?team_id=${getTeamId()}`, role, {
			headers: constructAuthHeaders(),
		});
	}
}
