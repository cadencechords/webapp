import * as Sentry from "@sentry/react";

import { Route, Switch } from "react-router-dom";
import { lazy, useEffect } from "react";
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
import PageLoading from "./PageLoading";
import TeamApi from "../api/TeamApi";
import UserApi from "../api/UserApi";
import { reportError } from "../utils/error";
import { setSubscription } from "../store/subscriptionSlice";
import { useHistory } from "react-router";

const EditorWorkbenchPage = lazy(() => import("../pages/EditorWorkbenchPage"));
const CustomerPortalSessionGeneratorPage = lazy(() =>
	import("../pages/CustomerPortalSessionGeneratorPage")
);
const SetPresenterPage = lazy(() => import("../pages/SetPresenterPage"));
const SongPresenterPage = lazy(() => import("../pages/SongPresenterPage"));

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
					Sentry.setUser({ email: data.email });
					dispatch(setCurrentUser(data));

					if (!data.timezone) saveTimeZone();

					if (!teamId) {
						router.push("/login/teams");
					} else {
						await fetchCurrentTeam();
					}
				} catch (error) {
					reportError(error);
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
				reportError(error);
				router.push("/login/teams");
			}
		}
	}, [hasCredentials, router, teamId, dispatch]);

	async function saveTimeZone() {
		let currentTimeZone = Intl?.DateTimeFormat().resolvedOptions().timeZone;
		if (currentTimeZone) {
			await UserApi.updateCurrentUser({ timezone: currentTimeZone });
		}
	}

	if (currentUser && currentTeam) {
		return (
			<Switch>
				<Route path="/editor" exact component={EditorWorkbenchPage} />
				<Route path="/songs/:id/present" exact component={SongPresenterPage} />
				<Route path="/sets/:id/present" exact component={SetPresenterPage} />
				<Route
					path="/customer_portal_session"
					exact
					component={CustomerPortalSessionGeneratorPage}
				/>
				<Route path="/">
					<Content />
				</Route>
			</Switch>
		);
	} else {
		return (
			<CenteredPage>
				<PageLoading>Please wait...</PageLoading>
			</CenteredPage>
		);
	}
}
