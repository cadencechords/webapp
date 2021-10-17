import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

import api from "./api";

export default class DashboardApi {
	static getDashboardData() {
		return api().get(`/dashboard?team_id=${getTeamId()}`, { headers: constructAuthHeaders() });
	}
}
