import BindersList from "./BindersList";
import { Route } from "react-router-dom";
import SongsList from "./SongsList";
import SetsList from "./SetsList";
import BinderDetail from "./BinderDetail";
import SongDetail from "./SongDetail";
import AccountDetail from "./AccountDetail";
import PersonalDetails from "./PersonalDetails";
import MembersList from "./MembersList";
import SetlistDetail from "./SetlistDetail";
import SongImportSources from "./SongImportSources";
import PlanningCenterRedirect from "./PlanningCenterRedirect";
import PlanningCenterSongsList from "./PlanningCenterSongsList";
import TeamDetail from "./TeamDetail";
import MemberDetail from "./MemberDetail";
import Sidenav from "./Sidenav";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import SearchPage from "./SearchPage";

export default function Content() {
	return (
		<>
			<Sidenav />
			<Navbar />
			<MobileNav />
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
					<Route path="/app/search">
						<SearchPage />
					</Route>
				</div>
			</div>
		</>
	);
}
