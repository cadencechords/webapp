import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

import api from "./api";

export default class ImportsApi {
	static import(songs) {
		if (songs) {
			let formData = new FormData();
			songs.forEach((song) => formData.append("files[]", song));

			return api().post(`/imports?team_id=${getTeamId()}`, formData, {
				headers: constructAuthHeaders(),
			});
		}
	}
}
