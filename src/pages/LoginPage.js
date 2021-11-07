import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

import Alert from "../components/Alert";
import AuthApi from "../api/AuthApi";
import Button from "../components/Button";
import { setAuth } from "../store/authSlice";
import { useDispatch } from "react-redux";

export default function LoginPage() {
	useEffect(() => (document.title = "Login"));
	const [canLogin, setCanLogin] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [alertMessage, setAlertMessage] = useState(null);
	const [alertColor, setAlertColor] = useState(null);
	const dispatch = useDispatch();
	const router = useHistory();

	const handlePasswordChange = (passwordValue) => {
		setPassword(passwordValue);
		setCanLogin(passwordValue !== "" && email !== "");
	};

	const handleEmailChange = (emailValue) => {
		setEmail(emailValue);
		setCanLogin(emailValue !== "" && password !== "");
	};

	const handleLogin = async () => {
		setLoading(true);
		try {
			let result = await AuthApi.login(email, password);
			let headers = result.headers;

			setAuthInLocalStorage(headers);
			router.push("/login/teams");
		} catch (error) {
			console.log(error?.response?.data);
			setAlertColor("red");
			setAlertMessage(error?.response?.data?.errors);
			setLoading(false);
			setPassword("");
			setCanLogin(false);
		}
	};

	const setAuthInLocalStorage = (headers) => {
		let accessToken = headers["access-token"];
		let client = headers["client"];
		let uid = headers["uid"];

		dispatch(setAuth({ accessToken, client, uid }));

		localStorage.setItem("access-token", headers["access-token"]);
		localStorage.setItem("uid", headers["uid"]);
		localStorage.setItem("client", headers["client"]);
	};

	return (
		<div className="w-screen h-screen flex">
			<div className="m-auto lg:w-2/5 sm:w-3/4 md:w-3/5 w-full px-3 max-w-xl">
				<h1 className="font-bold text-3xl text-center mb-1">Login to your account</h1>
				<div className="text-center mb-4">
					Or
					<Link to="/signup" className="text-blue-600 font-semibold ml-1">
						sign up for one!
					</Link>
				</div>
				<div className="pt-5 pb-3">
					<input
						className="appearance-none px-3 py-2 border-gray-300 focus:outline-none outline-none w-full border rounded-t-md focus:ring-inset focus:ring-2 focus:ring-blue-400 "
						placeholder="email"
						type="email"
						autoComplete="off"
						autoCapitalize="off"
						onChange={(e) => handleEmailChange(e.target.value)}
						value={email}
					/>

					<input
						className="appearance-none px-3 py-2 shadow-sm focus:outline-none border-gray-300 outline-none w-full border rounded-b-md border-t-0 focus:ring-inset focus:ring-2 focus:ring-blue-400"
						placeholder="password"
						type="password"
						autoComplete="off"
						autoCapitalize="off"
						onChange={(e) => handlePasswordChange(e.target.value)}
						value={password}
					/>
				</div>
				<div className="mb-4 text-right font-semibold text-blue-600">
					<Link to="/forgot_password">Forgot password?</Link>
				</div>
				{alertMessage && (
					<div className="mb-6">
						<Alert color={alertColor} dismissable onDismiss={() => setAlertMessage(null)}>
							{alertMessage}
						</Alert>
					</div>
				)}
				<div className="my-3">
					<Button full bold disabled={!canLogin} loading={loading} onClick={handleLogin}>
						Login
					</Button>
				</div>
			</div>
		</div>
	);
}
