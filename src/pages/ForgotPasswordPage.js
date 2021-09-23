import { useEffect, useState } from "react";

import Alert from "../components/Alert";
import AuthApi from "../api/AuthApi";
import Button from "../components/Button";
import CenteredPage from "../components/CenteredPage";
import OutlinedInput from "../components/inputs/OutlinedInput";
import PageTitle from "../components/PageTitle";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState();
	const [sending, setSending] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	useEffect(() => {
		document.title = "Forgot Password";
	}, []);

	const handleSendInstructions = async () => {
		try {
			setSending(true);
			await AuthApi.sendResetPasswordInstructions(email);
			setShowSuccess(true);
		} catch (error) {
			console.log(error);
		} finally {
			setSending(false);
		}
	};

	const handleEnterPressed = () => {
		if (email) {
			handleSendInstructions();
		}
	};

	return (
		<CenteredPage>
			<PageTitle title="Reset Password" align="center" />
			<div className="font-semibold text-gray-600 text-lg mb-6">
				Enter the email address you used to register with Cadence. If the email matches an account
				in Cadence, we'll send you instructions to reset your password.
			</div>
			<OutlinedInput
				className="mb-6"
				onChange={setEmail}
				placeholder="Email address"
				onEnter={handleEnterPressed}
				value={email}
			/>
			{showSuccess && (
				<Alert className="mb-6">
					If you have an account with Cadence, you should receive an email soon!
				</Alert>
			)}
			<Button full disabled={!email} loading={sending} onClick={handleSendInstructions}>
				Send instructions
			</Button>
		</CenteredPage>
	);
}
