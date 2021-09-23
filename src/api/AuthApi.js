import axios from "axios";

const AUTH_URL = `${process.env.REACT_APP_API_URL}/auth`;
const WEB_APP_URL = process.env.REACT_APP_URL;

export default class AuthApi {
	static signUp(email, password, passwordConfirmation) {
		return axios.post(process.env.REACT_APP_API_URL + "/auth", {
			email,
			password,
			password_confirmation: passwordConfirmation,
		});
	}

	static login(email, password) {
		return axios.post(process.env.REACT_APP_API_URL + "/auth/sign_in", { email, password });
	}

	static sendResetPasswordInstructions(email) {
		return axios.post(`${AUTH_URL}/password`, {
			email,
			redirect_url: `${WEB_APP_URL}/reset_password`,
		});
	}

	static resetPassword(config) {
		return axios.put(
			`${AUTH_URL}/password`,
			{ password: config.password, password_confirmation: config.passwordConfirmation },
			{
				headers: {
					"access-token": config["access-token"],
					uid: config.uid,
					client: config.client,
				},
			}
		);
	}
}
