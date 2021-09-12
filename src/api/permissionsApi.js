import axios from "axios";

const PERMISSIONS_URL = process.env.REACT_APP_API_URL + "/permissions";

export default class PermissionsApi {
	static getAll() {
		return axios.get(PERMISSIONS_URL);
	}

	static getOne(id) {
		return axios.get(`${PERMISSIONS_URL}/${id}`);
	}
}
