import { constructAuthHeaders, getTeamId } from "../utils/AuthUtils";
import axios from "axios";

const INVITATIONS_URL = process.env.REACT_APP_API_URL + "/invitations";

export default class InvitationApi {
	static createOne(newInvite) {
		if (newInvite) {
			let allowedParams = {};

			if (newInvite.email) allowedParams.email = newInvite.email;

			allowedParams.team_id = getTeamId();

			return axios.post(INVITATIONS_URL, allowedParams, {
				headers: constructAuthHeaders(),
			});
		}
	}

	static getAll() {
		return axios.get(`${INVITATIONS_URL}?team_id=${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}

	static resendOne(invitationId) {
		return axios.post(
			`${INVITATIONS_URL}/${invitationId}/resend`,
			{
				team_id: getTeamId(),
			},
			{
				headers: constructAuthHeaders(),
			}
		);
	}

	static deleteOne(invitationId) {
		return axios.delete(`${INVITATIONS_URL}/${invitationId}?team_id=${getTeamId()}`, {
			headers: constructAuthHeaders(),
		});
	}

	static claimOne(token) {
		return axios.post(
			`${INVITATIONS_URL}/claim`,
			{
				token,
			},
			{
				headers: constructAuthHeaders(),
			}
		);
	}

	static signUpThroughToken(token, password, passwordConfirmation) {
		return axios.post(`${INVITATIONS_URL}/signup`, {
			token,
			password,
			password_confirmation: passwordConfirmation,
		});
	}
}
