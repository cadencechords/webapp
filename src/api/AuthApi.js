import axios from "axios";

// const AUTH_URL = `${process.env.REACT_APP_API_URL}/AUTH`;
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
}
