import { useState, useEffect } from "react";
import CenteredPage from "./CenteredPage";
import OutlinedInput from "./inputs/OutlinedInput";
import { useQuery } from "./ClaimInvitation";
import PasswordRequirements from "./PasswordRequirements";
import FilledButton from "./buttons/FilledButton";
import Alert from "./Alert";
import InvitationApi from "../api/InvitationApi";
import { useDispatch } from "react-redux";
import { setTeamId, setAuth } from "../store/authSlice";
import { useHistory } from "react-router";

export default function InvitationSignUp() {
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [isPasswordFocused, setIsPasswordFocused] = useState(false);
	const [isLongEnough, setIsLongEnough] = useState(false);
	const [isUncommon, setIsUncommon] = useState(false);
	const [alertMessage, setAlertMessage] = useState(null);
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const router = useHistory();

	const MIN_PASSWORD_LENGTH = 8;
	const token = useQuery().get("token");

	const canSignUp = isUncommon && isLongEnough && token && password === passwordConfirmation;

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
	};

	const handleSignUp = async () => {
		setLoading(true);
		try {
			let result = await InvitationApi.signUpThroughToken(token, password, passwordConfirmation);
			let accessToken = result.headers["access-token"];
			let client = result.headers["client"];
			let uid = result.headers["uid"];
			dispatch(setAuth({ accessToken, client, uid }));
			dispatch(setTeamId(result.data.team_id));

			router.push("/app");
		} catch (error) {
			setAlertMessage(error?.response?.data?.message);
			setLoading(false);
		}
	};

	if (token) {
		return (
			<CenteredPage>
				<h1 className="font-bold text-3xl text-center mb-2">
					Create a password for your new account
				</h1>

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
							<PasswordRequirements isUncommon={isUncommon} isLongEnough={isLongEnough} />
						</div>
					)}
				</div>

				<div className="mb-2">Confirm Password</div>
				<div className="mb-4">
					<OutlinedInput
						value={passwordConfirmation}
						placeholder="enter your password again"
						type="password"
						onChange={setPasswordConfirmation}
					/>
				</div>

				{alertMessage && (
					<div className="mb-6">
						<Alert color="red" dismissable onDismiss={() => setAlertMessage(null)}>
							{alertMessage}
						</Alert>
					</div>
				)}

				<FilledButton full bold disabled={!canSignUp} loading={loading} onClick={handleSignUp}>
					Sign Up
				</FilledButton>
			</CenteredPage>
		);
	} else {
		return (
			<CenteredPage>
				<Alert color="red">Invalid invitation</Alert>
			</CenteredPage>
		);
	}
}
