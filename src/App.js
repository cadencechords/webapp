import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import ClaimInvitationPage from "./pages/ClaimInvitationPage";
import CreateNewTeamPage from "./pages/CreateNewTeamPage";
import EmailConfirmedPage from "./pages/EmailConfirmedPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import InvitationSignUpPage from "./pages/InvitationSignUpPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SecuredRoutes from "./components/SecuredRoutes";
import SignUpPage from "./pages/SignUpPage";
import TeamLoginPage from "./pages/TeamLoginPage";

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
					<Route path="/forgot_password" exact>
						<ForgotPasswordPage />
					</Route>
					<Route path="/reset_password" exact>
						<ResetPasswordPage />
					</Route>
					<SecuredRoutes />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
