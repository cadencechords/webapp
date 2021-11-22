import { Link, useHistory, useLocation } from "react-router-dom";
import { setAuth, setTeamId } from "../store/authSlice";
import { useEffect, useState } from "react";

import Alert from "../components/Alert";
import Button from "../components/Button";
import CenteredPage from "../components/CenteredPage";
import InvitationApi from "../api/InvitationApi";
import PulseLoader from "react-spinners/PulseLoader";
import { reportError } from "../utils/error";
import { useDispatch } from "react-redux";

export function useQuery() {
	return new URLSearchParams(useLocation().search);
}

export default function ClaimInvitationPage() {
	const token = useQuery().get("token");
	const [claimingToken, setClaimingToken] = useState(false);
	const [errors, setErrors] = useState(null);

	const dispatch = useDispatch();
	const router = useHistory();

	useEffect(() => {
		async function claimToken() {
			setClaimingToken(true);
			try {
				let result = await InvitationApi.claimOne(token);
				let accessToken = result.headers["access-token"];
				let client = result.headers["client"];
				let uid = result.headers["uid"];
				dispatch(setAuth({ accessToken, client, uid }));
				dispatch(setTeamId(result.data.team_id));
				router.push("/");
			} catch (error) {
				reportError(error);
				if (error.response.status === 404) {
					setErrors(error.response.data.message);
					setClaimingToken(false);
				} else if (error.response.status === 400) {
					router.push(`/invitations/signup?token=${token}`);
				}
			}
		}

		if (token) {
			claimToken();
		}
	}, [token, dispatch, router]);

	if (!token) {
		return (
			<CenteredPage>
				<div className="text-center">
					Uh oh, looks like something went wrong.
					<Link className="mt-3 block" to="/login">
						<Button>Take me home</Button>
					</Link>
				</div>
			</CenteredPage>
		);
	} else if (claimingToken) {
		return (
			<CenteredPage>
				<div className="text-center">
					<div className="mb-4 font-semibold">Claiming your invitation</div>
					<PulseLoader color="blue" />
				</div>
			</CenteredPage>
		);
	} else if (errors) {
		return (
			<CenteredPage>
				<Alert color="red">{errors}</Alert>
			</CenteredPage>
		);
	}
	return <></>;
}
