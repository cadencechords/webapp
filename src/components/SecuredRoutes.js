import { Route } from "react-router-dom";
import UserApi from "../api/UserApi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	selectCurrentTeam,
	selectCurrentUser,
	selectHasCredentials,
	selectTeamId,
	setCurrentTeam,
	setCurrentUser,
	setMembership,
} from "../store/authSlice";
import TeamApi from "../api/TeamApi";
import { useHistory } from "react-router";
import PageLoading from "./PageLoading";
import Content from "./Content";
import CenteredPage from "./CenteredPage";

import EditorWorkbenchPage from "../pages/EditorWorkbenchPage";
import SongPresenterPage from "../pages/SongPresenterPage";
import SetPresenterPage from "../pages/SetPresenterPage";

export default function SecuredRoutes() {
	const dispatch = useDispatch();
	const hasCredentials = useSelector(selectHasCredentials);
	const teamId = useSelector(selectTeamId);
	const router = useHistory();
	const currentUser = useSelector(selectCurrentUser);
	const currentTeam = useSelector(selectCurrentTeam);

	useEffect(() => {
		if (!hasCredentials) {
			router.push("/login");
		} else {
			async function fetchCurrentUser() {
				try {
					let { data } = await UserApi.getCurrentUser();
					dispatch(setCurrentUser(data));
					if (!teamId) {
						router.push("/login/teams");
					} else {
						await fetchCurrentTeam();
					}
				} catch (error) {
					console.log(error);
					router.push("/login");
				}
			}

			fetchCurrentUser();
		}

		async function fetchCurrentTeam() {
			try {
				let { data } = await TeamApi.getCurrentTeam();
				dispatch(setCurrentTeam(data.team));

				let membershipResponse = await UserApi.getTeamMembership();
				dispatch(
					setMembership({
						is_admin: membershipResponse.data.is_admin,
						role: membershipResponse.data.role,
					})
				);
			} catch (error) {
				console.log(error);
				router.push("/login/teams");
			}
		}
	}, [hasCredentials, router, teamId, dispatch]);

	if (currentUser && currentTeam) {
		return (
			<>
				<Route path="/editor" exact>
					<EditorWorkbenchPage />
				</Route>
				<Route path="/songs/:id/present" exact>
					<SongPresenterPage />
				</Route>
				<Route path="/sets/:id/present" exact>
					<SetPresenterPage />
				</Route>
				<Route path="/">
					<Content />
				</Route>
			</>
		);
	} else {
		return (
			<CenteredPage>
				<PageLoading>Please wait...</PageLoading>
			</CenteredPage>
		);
	}
}
