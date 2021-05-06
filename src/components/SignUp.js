import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import FilledButton from "./buttons/FilledButton";
import OutlinedInput from "./inputs/OutlinedInput";
import PasswordRequirements from "./PasswordRequirements";
import AuthApi from "../api/AuthApi";
import Alert from "./Alert";

export default function SignUp() {
	const [isPasswordFocused, setIsPasswordFocused] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [passwordsMatch, setPasswordsMatch] = useState(false);
	const [isLongEnough, setIsLongEnough] = useState(false);
	const [isUncommon, setIsUncommon] = useState(false);
	const [canSignUp, setCanSignUp] = useState(false);
	const [loading, setLoading] = useState(false);
	const [alertMessage, setAlertMessage] = useState(null);
	const [alertColor, setAlertColor] = useState(null);

	const router = useHistory();

	const MIN_PASSWORD_LENGTH = 8;

	useEffect(() => {
		document.title = "Sign Up";
		const script = document.createElement("script");

		script.src = "http://localhost:3000/scripts/passwords.js";
		script.async = true;

		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	const handlePasswordChange = (passwordValue) => {
		setPassword(passwordValue);

		setIsLongEnough(passwordValue.length >= MIN_PASSWORD_LENGTH);

		let { score } = window.zxcvbn(passwordValue);

		setIsUncommon(score >= 3);

		setCanSignUp(
			passwordValue === passwordConfirmation &&
			score >= 3 &&
			passwordValue.length >= MIN_PASSWORD_LENGTH &&
			email !== ""
		);
	};

	const handleConfirmationChange = (confirmationValue) => {
		setPasswordsMatch(confirmationValue === password);
		setPasswordConfirmation(confirmationValue);

		setCanSignUp(
			confirmationValue === password &&
			isUncommon &&
			isLongEnough &&
			email !== ""
		);
	};

	const handleEmailChange = (emailValue) => {
		setEmail(emailValue);

		setCanSignUp(
			passwordConfirmation === password &&
			isUncommon &&
			isLongEnough &&
			emailValue !== ""
		);
	};

	const handleSignUp = async () => {
		setLoading(true);

		try {
			let { status } = await AuthApi.signUp(email, password, passwordConfirmation);
			setAlertColor("blue");
			setAlertMessage("Thanks for signing up! Check your email for further instructions.");
		} catch (error) {
			setAlertColor("red");
			setAlertMessage(error?.response?.data?.errors?.full_messages);
		} finally {
			setLoading(false);
			clearFields();
		}
	}

	const clearFields = () => {
		setEmail("");
		setPassword("");
		setPasswordConfirmation("");
		setIsPasswordFocused(false);
		setIsLongEnough(false);
		setCanSignUp(false);
		setIsUncommon(false);
	}

	return (
		<div className="w-screen h-screen flex">
			<div className="m-auto lg:w-2/5 sm:w-3/4 md:w-3/5 w-full px-3 max-w-xl">
				<h1 className="font-bold text-3xl text-center mb-2">
					Sign up for an account
				</h1>
				<div className="text-center mb-4">
					Or
					<Link to="/login" className="text-blue-600 font-semibold ml-1">
						login here
					</Link>
				</div>
				<div className="py-2">
					<div className="mb-2">Email</div>
					<div className="mb-4">
						<OutlinedInput
							placeholder="email"
							type="email"
							onChange={handleEmailChange}
							value={email}
						/>

					</div>
					<div className="mb-2">Password</div>
					<div className="mb-4">
						<OutlinedInput
							value={password}
							placeholder="password"
							type="password"
							onFocus={() => setIsPasswordFocused(true)}
							onChange={handlePasswordChange}
						/>

						{isPasswordFocused && (
							<div className="mt-4">
								<PasswordRequirements
									isUncommon={isUncommon}
									isLongEnough={isLongEnough}
								/></div>
						)}
					</div>

					<div className="mb-2">Confirm Password</div>
					<div className="mb-4">
						<OutlinedInput
							value={passwordConfirmation}
							placeholder="enter your password again"
							type="password"
							onChange={handleConfirmationChange}
						/>
					</div>
				</div>
				{alertMessage && <div className="mb-6">
					<Alert color={alertColor} dismissable onDismiss={() => setAlertMessage(null)}>
						{alertMessage}
					</Alert>
				</div>}

				<FilledButton full bold disabled={!canSignUp} loading={loading} onClick={handleSignUp}>
					Sign Up
				</FilledButton>
			</div>
		</div>
	);
}
