import api from "./api";
import { constructAuthHeaders } from "../utils/AuthUtils";

export default class SubscriptionsApi {
	static getAll() {
		return api().get(`/users/me/subscriptions`, { headers: constructAuthHeaders() });
	}
}
