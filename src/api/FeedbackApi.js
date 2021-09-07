import axios from "axios";
import { constructAuthHeaders } from "../utils/AuthUtils";

const FEEDBACK_URL = process.env.REACT_APP_API_URL + "/feedback";

export default class FeedbackApi {
	static create(feedback) {
		return axios.post(FEEDBACK_URL, feedback, { headers: constructAuthHeaders() });
	}
}
