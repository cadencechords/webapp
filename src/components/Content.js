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
					<Route path="/binders/:id" exact>
						<BinderDetailPage />
					</Route>
					<Route path="/binders" exact>
						<BindersIndexPage />
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
				</div>
			</div>
		</>
	);
}
