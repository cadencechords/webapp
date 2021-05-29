import { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import FilledButton from "./buttons/FilledButton";
import CenteredPage from "./CenteredPage";
import PulseLoader from "react-spinners/PulseLoader";
import InvitationApi from "../api/InvitationApi";
import { useDispatch } from "react-redux";
import { setAuth, setTeamId } from "../store/authSlice";
import Alert from "./Alert";

export function useQuery() {
	return new URLSearchParams(useLocation().search);
}

export default function ClaimInvitation() {
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
				router.push("/app");
			} catch (error) {
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
					<Link className="mt-3 inline-block" to="/login">
						<FilledButton>Take me home</FilledButton>
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
