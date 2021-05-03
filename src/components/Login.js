import { useState } from "react";
import { Link } from "react-router-dom";
import FilledButton from "./buttons/FilledButton";

export default function Login() {
	const [canLogin, setCanLogin] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handlePasswordChange = (passwordValue) => {
		setPassword(passwordValue);
		setCanLogin(passwordValue !== "" && email !== "");
	};

	const handleEmailChange = (emailValue) => {
		setEmail(emailValue);
		setCanLogin(emailValue !== "" && password !== "");
	};

	return (
		<div className="w-screen h-screen flex">
			<div className="m-auto lg:w-2/5 sm:w-3/4 md:w-3/5 w-full px-3 max-w-xl">
				<h1 className="font-bold text-3xl text-center mb-1">
					Login to your account
				</h1>
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
					/>

					<input
						className="px-3 py-2 shadow-sm focus:outline-none border-gray-300 outline-none w-full border rounded-b-md border-t-0 focus:ring-inset focus:ring-2 focus:ring-blue-400"
						placeholder="password"
						type="password"
						autoComplete="off"
						autoCapitalize="off"
						onChange={(e) => handlePasswordChange(e.target.value)}
					/>
				</div>
				<div className="my-3">
					<FilledButton full bold disabled={!canLogin}>
						Login
					</FilledButton>
				</div>
			</div>
		</div>
	);
}
