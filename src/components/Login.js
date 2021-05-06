import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import FilledButton from "./buttons/FilledButton";
import AuthApi from "../api/AuthApi";
import Alert from "./Alert";

export default function Login() {
	const [canLogin, setCanLogin] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [alertMessage, setAlertMessage] = useState(null);
	const [alertColor, setAlertColor] = useState(null);
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
			console.log(error.response.data);
			setAlertColor("red");
			setAlertMessage(error?.response?.data?.errors);
			setLoading(false);
			clearFormFields();
		}
	};

	const setAuthInLocalStorage = (headers) => {
		localStorage.setItem("access-token", headers["access-token"]);
		localStorage.setItem("uid", headers["uid"]);
		localStorage.setItem("client", headers["client"]);
	};

	const clearFormFields = () => {
		setEmail("");
		setPassword("");
		setCanLogin(false);
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
				<div className="py-5">
					<input
						className="px-3 py-2 border-gray-300 focus:outline-none outline-none w-full border rounded-t-md focus:ring-inset focus:ring-2 focus:ring-blue-400 "
						placeholder="email"
						type="email"
						autoComplete="off"
						autoCapitalize="off"
						onChange={(e) => handleEmailChange(e.target.value)}
						value={email}
					/>

					<input
						className="px-3 py-2 shadow-sm focus:outline-none border-gray-300 outline-none w-full border rounded-b-md border-t-0 focus:ring-inset focus:ring-2 focus:ring-blue-400"
						placeholder="password"
						type="password"
						autoComplete="off"
						autoCapitalize="off"
						onChange={(e) => handlePasswordChange(e.target.value)}
						value={password}
					/>
				</div>
				{alertMessage && (
					<div className="mb-6">
						<Alert color={alertColor} dismissable onDismiss={() => setAlertMessage(null)}>
							{alertMessage}
						</Alert>
					</div>
				)}
				<div className="my-3">
					<FilledButton full bold disabled={!canLogin} loading={loading} onClick={handleLogin}>
						Login
					</FilledButton>
				</div>
			</div>
		</div>
	);
}
