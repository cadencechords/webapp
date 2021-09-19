import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

import axios from "axios";

const ONSONG_URL = process.env.REACT_APP_API_URL + "/onsong";
export default class OnsongApi {
	static unzip(file) {
		let formData = new FormData();
		formData.append("backup", file);
		return axios.post(`${ONSONG_URL}/unzip?team_id=${getTeamId()}`, formData, {
			headers: constructAuthHeaders(),
		});
	}

	static import(songs, binderId, importId) {
		let importParams = {
			songs,
		};

		if (binderId) {
			importParams.binder_id = binderId;
		}

		return axios.post(`${ONSONG_URL}/import/${importId}?team_id=${getTeamId()}`, importParams, {
			headers: constructAuthHeaders(),
		});
	}
}
