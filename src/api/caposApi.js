import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

import api from "./api";

export default class CaposApi {
	static create(capo, songId) {
		return api().post(
			`/songs/${songId}/capos?team_id=${getTeamId()}`,
			{ capo_key: capo },
			{ headers: constructAuthHeaders() }
		);
	}

	static update(capoId, songId, updates) {
		return api().put(`/songs/${songId}/capos/${capoId}?team_id=${getTeamId()}`, updates, {
			headers: constructAuthHeaders(),
		});
	}

	static delete(capoId, songId) {
		return api().delete(`/songs/${songId}/capos/${capoId}?team_id=${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}
}
