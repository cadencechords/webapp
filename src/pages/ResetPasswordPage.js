import { useEffect, useState } from "react";

import Alert from "../components/Alert";
import AuthApi from "../api/AuthApi";
import Button from "../components/Button";
import CenteredPage from "../components/CenteredPage";
import OutlinedInput from "../components/inputs/OutlinedInput";
import PageTitle from "../components/PageTitle";
import PasswordRequirements from "../components/PasswordRequirements";
import { useHistory } from "react-router-dom";
import { useQuery } from "./ClaimInvitationPage";

export default function ResetPasswordage() {
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [isLongEnough, setIsLongEnough] = useState(false);
	const [isUncommon, setIsUncommon] = useState(false);
	const [alertMessage, setAlertMessage] = useState(null);
	const [loading, setLoading] = useState(false);
	const router = useHistory();

	const MIN_PASSWORD_LENGTH = 8;

	const authConfig = {
		token: useQuery().get("token"),
		"access-token": useQuery().get("access-token"),
		uid: useQuery().get("uid"),
		client: useQuery().get("client"),
	};

	const canSignUp =
		isUncommon && isLongEnough && hasAuthConfig() && password === passwordConfirmation;

	useEffect(() => {
		document.title = "Reset Password";
		const script = document.createElement("script");

		script.src = process.env.REACT_APP_URL + "/scripts/passwords.js";
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

	const handleConfirmPasswordChange = async () => {
		try {
			setLoading(true);
			await AuthApi.resetPassword({ password, passwordConfirmation, ...authConfig });
			router.push("/login");
		} catch (error) {
			setAlertMessage(error?.response?.data?.errors);
			setLoading(false);
		}
	};

	function hasAuthConfig() {
		return (
			authConfig &&
			authConfig["access-token"] &&
			authConfig.client &&
			authConfig.token &&
			authConfig.uid
		);
	}

	if (hasAuthConfig()) {
		return (
			<CenteredPage>
				<PageTitle title="New Password" align="center" className="mb-4" />

				<div className="mb-2">Password</div>
				<div className="mb-4">
					<OutlinedInput
						value={password}
						placeholder="password"
						type="password"
						onChange={handlePasswordChange}
					/>

					<div className="mt-4">
						<PasswordRequirements isUncommon={isUncommon} isLongEnough={isLongEnough} />
					</div>
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

				<Button full disabled={!canSignUp} loading={loading} onClick={handleConfirmPasswordChange}>
					Set password
				</Button>
			</CenteredPage>
		);
	} else {
		return (
			<CenteredPage>
				<Alert color="red">Invalid reset password link</Alert>
			</CenteredPage>
		);
	}
}
