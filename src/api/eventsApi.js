import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

import api from "./api";

export default class EventsApi {
	static getAll() {
		return api().get(`/events?team_id=${getTeamId()}`, { headers: constructAuthHeaders() });
	}

	static get(id) {
		return api().get(`/events/${id}?team_id=${getTeamId()}`, { headers: constructAuthHeaders() });
	}

	static create(event) {
		return api().post(
			"/events",
			{
				...event,
				team_id: getTeamId(),
			},
			{ headers: constructAuthHeaders() }
		);
	}

	static delete(id) {
		return api().delete(`/events/${id}?team_id=${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}

	static update(updates, id) {
		return api().put(`/events/${id}?team_id=${getTeamId()}`, updates, {
			headers: constructAuthHeaders(),
		});
	}
}
