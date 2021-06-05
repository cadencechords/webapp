import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";
import axios from "axios";

const PCO_URL = process.env.REACT_APP_API_URL + "/pco";

export default class PlanningCenterApi {
	static authorize(code) {
		return axios.post(
			PCO_URL + "/auth",
			{ code, team_id: getTeamId() },
			{ headers: constructAuthHeaders() }
		);
	}
}
