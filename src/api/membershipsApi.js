import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

import axios from "axios";

const MEMBERSHIPS_URL = process.env.REACT_APP_API_URL + "/memberships";

export default class MembershipsApi {
	static assignRole(memberId, roleName) {
		return axios.post(
			`${MEMBERSHIPS_URL}/${memberId}/role?team_id=${getTeamId()}`,
			{ name: roleName },
			{ headers: constructAuthHeaders() }
		);
	}
}
