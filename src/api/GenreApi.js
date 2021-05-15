import { constructAuthHeaders } from "../utils/AuthUtils";
import axios from "axios";

const GENRES_URL = process.env.REACT_APP_API_URL + "/genres";

export default class GenreApi {
	static getAll() {
		return axios.get(GENRES_URL, { headers: constructAuthHeaders() });
	}
}
