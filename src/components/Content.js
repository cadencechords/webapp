import TeamDetailPage from "../pages/TeamDetailPage";
import SetlistDetailPage from "../pages/SetlistDetailPage";
import AccountDetailPage from "../pages/AccountDetailPage";
import BinderDetailPage from "../pages/BinderDetailPage";
import SongDetailPage from "../pages/SongDetailPage";
import MemberDetailPage from "../pages/MemberDetailPage";

import BindersIndexPage from "../pages/BindersIndexPage";
import SetlistsIndexPage from "../pages/SetlistsIndexPage";
import SongsIndexPage from "../pages/SongsIndexPage";
import MembersIndexPage from "../pages/MembersIndexPage";
import PcoSongsIndexPage from "../pages/PcoSongsIndexPage";
import SongImportSourcesIndexPage from "../pages/SongImportSourcesIndexPage";

import PcoRedirectPage from "../pages/PcoRedirectPage";
import PersonalDetails from "./PersonalDetails";
import SearchPage from "./SearchPage";

import { Route } from "react-router-dom";
import Sidenav from "./Sidenav";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

export default function Content() {
	return (
		<>
			<Sidenav />
			<Navbar />
			<MobileNav />
			<div className="md:ml-56 md:px-10 px-2 py-3">
				<div className="container mx-auto">
					<Route path="/app/binders/:id" exact>
						<BinderDetailPage />
					</Route>
					<Route path="/app/binders" exact>
						<BindersIndexPage />
					</Route>
					<Route path="/app/import/pco/songs" exact>
						<PcoSongsIndexPage />
					</Route>
					<Route path="/app/import/pco_redirect" exact>
						<PcoRedirectPage />
					</Route>
					<Route path="/app/import" exact>
						<SongImportSourcesIndexPage />
					</Route>
					<Route path="/app/songs/:id" exact>
						<SongDetailPage />
					</Route>
					<Route path="/app/songs" exact>
						<SongsIndexPage />
					</Route>
					<Route path="/app/sets" exact>
						<SetlistsIndexPage />
					</Route>
					<Route path="/app/sets/:id" exact>
						<SetlistDetailPage />
					</Route>
					<Route path="/app/account/personal" exact>
						<PersonalDetails />
					</Route>
					<Route path="/app/account" exact>
						<AccountDetailPage />
					</Route>
					<Route path="/app/members/:id" exact>
						<MemberDetailPage />
					</Route>
					<Route path="/app/members" exact>
						<MembersIndexPage />
					</Route>
					<Route path="/app/team">
						<TeamDetailPage />
					</Route>
					<Route path="/app/search">
						<SearchPage />
					</Route>
				</div>
			</div>
		</>
	);
}
