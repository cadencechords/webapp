import { Route, Switch } from "react-router-dom";
import {
	selectCurrentTeam,
	selectCurrentUser,
	selectHasCredentials,
	selectTeamId,
	setCurrentTeam,
	setCurrentUser,
	setMembership,
} from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

import CenteredPage from "./CenteredPage";
import Content from "./Content";
import CustomerPortalSessionGeneratorPage from "../pages/CustomerPortalSessionGeneratorPage";
import EditorWorkbenchPage from "../pages/EditorWorkbenchPage";
import PageLoading from "./PageLoading";
import SetPresenterPage from "../pages/SetPresenterPage";
import SongPresenterPage from "../pages/SongPresenterPage";
import TeamApi from "../api/TeamApi";
import UserApi from "../api/UserApi";
import { setSubscription } from "../store/subscriptionSlice";
import { useEffect } from "react";
import { useHistory } from "react-router";

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
				dispatch(setSubscription(data.subscription));

				let membershipResponse = await UserApi.getTeamMembership();
				dispatch(
					setMembership({
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
				<Switch>
					<Route path="/editor" exact>
						<EditorWorkbenchPage />
					</Route>
					<Route path="/songs/:id/present" exact>
						<SongPresenterPage />
					</Route>
					<Route path="/sets/:id/present" exact>
						<SetPresenterPage />
					</Route>
					<Route path="/customer_portal_session" exact>
						<CustomerPortalSessionGeneratorPage />
					</Route>
					<Route path="/">
						<Content />
					</Route>
				</Switch>
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
