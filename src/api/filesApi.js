import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";

import api from "./api";

export default class FilesApi {
	static addFilesToSong(songId, files) {
		let formData = new FormData();
		files.forEach((file) => formData.append("files[]", file));

		return api().post(`/songs/${songId}/files?team_id=${getTeamId()}`, formData, {
			headers: constructAuthHeaders(),
		});
	}

	static getFilesForSong(songId) {
		return api().get(`/songs/${songId}/files?team_id=${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}

	static deleteSongFile(songId, fileId) {
		return api().delete(`/songs/${songId}/files/${fileId}?team_id=${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}

	static updateSongFile(songId, fileId, updates) {
		return api().put(`/songs/${songId}/files/${fileId}?team_id=${getTeamId()}`, updates, {
			headers: constructAuthHeaders(),
		});
	}
}
