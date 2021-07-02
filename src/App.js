import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SecuredRoutes from "./components/SecuredRoutes";

import ClaimInvitationPage from "./pages/ClaimInvitationPage";
import InvitationSignUpPage from "./pages/InvitationSignUpPage";
import EmailConfirmedPage from "./pages/EmailConfirmedPage";
import CreateNewTeamPage from "./pages/CreateNewTeamPage";
import TeamLoginPage from "./pages/TeamLoginPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
	return (
		<div>
			<Router>
				<Switch>
					<Route path="/login" exact>
						<LoginPage />
					</Route>
					<Route path="/login/teams" exact>
						<TeamLoginPage />
					</Route>
					<Route path="/login/teams/new" exact>
						<CreateNewTeamPage />
					</Route>
					<Route path="/confirmation" exact>
						<EmailConfirmedPage />
					</Route>
					<Route path="/signup" exact>
						<SignUpPage />
					</Route>
					<Route path="/invitations" exact>
						<ClaimInvitationPage />
					</Route>
					<Route path="/invitations/signup" exact>
						<InvitationSignUpPage />
					</Route>
					<SecuredRoutes />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
