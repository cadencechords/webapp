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
import { selectTeamId, setCurrentTeam, setCurrentUser } from "../store/authSlice";
import MembersList from "./MembersList";
import TeamApi from "../api/TeamApi";
import SetlistDetail from "./SetlistDetail";
import SongImportSources from "./SongImportSources";
import PlanningCenterRedirect from "./PlanningCenterRedirect";

export default function Content() {
	const dispatch = useDispatch();
	const teamId = useSelector(selectTeamId);

	useEffect(() => {
		async function fetchCurrentUser() {
			try {
				let { data } = await UserApi.getCurrentUser();
				dispatch(setCurrentUser(data));
			} catch (error) {
				console.log(error);
			}
		}

		fetchCurrentUser();
	});

	useEffect(() => {
		async function fetchCurrentTeam() {
			let { data } = await TeamApi.getCurrentTeam();
			dispatch(setCurrentTeam(data.team));
			document.title = data.team.name;
		}
		fetchCurrentTeam();
	}, [teamId]);

	return (
		<div className="md:ml-56 md:px-10 px-2 py-3">
			<div className="container mx-auto">
				<Route path="/app/binders/:id" exact>
					<BinderDetail />
				</Route>
				<Route path="/app/binders" exact>
					<BindersList />
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
				<Route path="/app/members" exact>
					<MembersList />
				</Route>
			</div>
		</div>
	);
}
