import AccountDetailPage from "../pages/AccountDetailPage";
import BinderDetailPage from "../pages/BinderDetailPage";
import BindersIndexPage from "../pages/BindersIndexPage";
import CalendarPage from "../pages/CalendarPage";
import MemberDetailPage from "../pages/MemberDetailPage";
import MembersIndexPage from "../pages/MembersIndexPage";
import MobileNav from "./MobileNav";
import Navbar from "./Navbar";
import OnsongImportPage from "../pages/OnsongImportPage";
import PcoRedirectPage from "../pages/PcoRedirectPage";
import PcoSongsIndexPage from "../pages/PcoSongsIndexPage";
import PersonalDetails from "./PersonalDetails";
import RoleDetailPage from "../pages/RoleDetailPage";
import RolesIndexPage from "../pages/RolesIndexPage";
import { Route } from "react-router-dom";
import SearchPage from "./SearchPage";
import SetlistDetailPage from "../pages/SetlistDetailPage";
import SetlistsIndexPage from "../pages/SetlistsIndexPage";
import Sidenav from "./Sidenav";
import SongDetailPage from "../pages/SongDetailPage";
import SongImportSourcesIndexPage from "../pages/SongImportSourcesIndexPage";
import SongsIndexPage from "../pages/SongsIndexPage";
import TeamDetailPage from "../pages/TeamDetailPage";

export default function Content() {
	return (
		<>
			<Sidenav />
			<Navbar />
			<MobileNav />
			<div className="md:ml-56 md:px-10 px-2 py-3">
				<div className="container mx-auto">
					<Route path="/binders/:id" exact>
						<BinderDetailPage />
					</Route>
					<Route path="/binders" exact>
						<BindersIndexPage />
					</Route>
					<Route path="/import/onsong" exact>
						<OnsongImportPage />
					</Route>
					<Route path="/import/pco/songs" exact>
						<PcoSongsIndexPage />
					</Route>
					<Route path="/import/pco_redirect" exact>
						<PcoRedirectPage />
					</Route>
					<Route path="/import" exact>
						<SongImportSourcesIndexPage />
					</Route>
					<Route path="/songs/:id" exact>
						<SongDetailPage />
					</Route>
					<Route path="/songs" exact>
						<SongsIndexPage />
					</Route>
					<Route path="/sets" exact>
						<SetlistsIndexPage />
					</Route>
					<Route path="/sets/:id" exact>
						<SetlistDetailPage />
					</Route>
					<Route path="/account/personal" exact>
						<PersonalDetails />
					</Route>
					<Route path="/account" exact>
						<AccountDetailPage />
					</Route>
					<Route path="/members/:id" exact>
						<MemberDetailPage />
					</Route>
					<Route path="/members" exact>
						<MembersIndexPage />
					</Route>
					<Route path="/team">
						<TeamDetailPage />
					</Route>
					<Route path="/search">
						<SearchPage />
					</Route>
					<Route path="/permissions/:id" exact>
						<RoleDetailPage />
					</Route>
					<Route path="/permissions" exact>
						<RolesIndexPage />
					</Route>
					<Route path="/calendar" exact>
						<CalendarPage />
					</Route>
				</div>
				<div className="h-12 md:h-0"></div>
			</div>
		</>
	);
}
