import BindersList from "./BindersList";
import { Route } from "react-router-dom";
import SongsList from "./SongsList";
import SetsList from "./SetsList";
import BinderDetail from "./BinderDetail";
import SongDetail from "./SongDetail";
import AccountDetail from "./AccountDetail";
import PersonalDetails from "./PersonalDetails";
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
import MembersList from "./MembersList";
import TeamApi from "../api/TeamApi";
import SetlistDetail from "./SetlistDetail";
import SongImportSources from "./SongImportSources";
import PlanningCenterRedirect from "./PlanningCenterRedirect";
import PlanningCenterSongsList from "./PlanningCenterSongsList";
import TeamDetail from "./TeamDetail";
import MemberDetail from "./MemberDetail";
import { useHistory } from "react-router";
import PageLoading from "./PageLoading";

export default function Content() {
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
			<div className="md:ml-56 md:px-10 px-2 py-3">
				<div className="container mx-auto">
					<Route path="/app/binders/:id" exact>
						<BinderDetail />
					</Route>
					<Route path="/app/binders" exact>
						<BindersList />
					</Route>
					<Route path="/app/import/pco/songs" exact>
						<PlanningCenterSongsList />
					</Route>
					<Route path="/app/import/pco_redirect" exact>
						<PlanningCenterRedirect />
					</Route>
					<Route path="/app/import" exact>
						<SongImportSources />
					</Route>
					<Route path="/app/songs/:id" exact>
						<SongDetail />
					</Route>
					<Route path="/app/songs" exact>
						<SongsList />
					</Route>
					<Route path="/app/sets" exact>
						<SetsList />
					</Route>
					<Route path="/app/sets/:id" exact>
						<SetlistDetail />
					</Route>
					<Route path="/app/account/personal" exact>
						<PersonalDetails />
					</Route>
					<Route path="/app/account" exact>
						<AccountDetail />
					</Route>
					<Route path="/app/members/:id" exact>
						<MemberDetail />
					</Route>
					<Route path="/app/members" exact>
						<MembersList />
					</Route>
					<Route path="/app/team">
						<TeamDetail />
					</Route>
				</div>
			</div>
		);
	} else {
		return <PageLoading>Please wait...</PageLoading>;
	}
}
