import axios from "axios";
import { constructAuthHeaders } from "../utils/AuthUtils";

const PUBLIC_SETLISTS_URL = process.env.REACT_APP_API_URL + "/public_setlists";

export default class PublicSetlistApi {
	static createOne(newPublicSetlist) {
		return axios.post(PUBLIC_SETLISTS_URL, newPublicSetlist, { headers: constructAuthHeaders() });
	}

	static getOne(setlistId) {
		return axios.get(`${PUBLIC_SETLISTS_URL}/${setlistId}`, { headers: constructAuthHeaders() });
	}

	static updateOne(code, updates) {
		return axios.put(`${PUBLIC_SETLISTS_URL}/${code}`, updates, {
			headers: constructAuthHeaders(),
		});
	}
}
