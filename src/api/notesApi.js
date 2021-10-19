import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

import api from "./api";

export default class NotesApi {
	static getAll(songId) {
		return api().get(`/songs/${songId}/notes?team_id=${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}

	static create(lineNumber, songId) {
		return api().post(
			`/songs/${songId}/notes?team_id=${getTeamId()}`,
			{ line_number: lineNumber },
			{ headers: constructAuthHeaders() }
		);
	}

	static update(songId, noteId, updates) {
		return api().put(`/songs/${songId}/notes/${noteId}?team_id=${getTeamId()}`, updates, {
			headers: constructAuthHeaders(),
		});
	}

	static delete(songId, noteId) {
		return api().delete(`/songs/${songId}/notes/${noteId}?team_id=${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}
}
