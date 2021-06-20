import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import EmailConfirmationSuccess from "./components/EmailConfirmationSuccess";
import TeamLogin from "./components/TeamLogin";
import CreateNewTeam from "./components/CreateNewTeam";
import ClaimInvitation from "./components/ClaimInvitation";
import InvitationSignUp from "./components/InvitationSignUp";
import SecuredRoutes from "./components/SecuredRoutes";

function App() {
	return (
		<div>
			<Router>
				<SecuredRoutes />
				<Route path="/login" exact>
					<Login />
				</Route>
				<Route path="/login/teams" exact>
					<TeamLogin />
				</Route>
				<Route path="/login/teams/new" exact>
					<CreateNewTeam />
				</Route>
				<Route path="/confirmation" exact>
					<EmailConfirmationSuccess />
				</Route>
				<Route path="/signup" exact>
					<SignUp />
				</Route>
				<Route path="/invitations" exact>
					<ClaimInvitation />
				</Route>
				<Route path="/invitations/signup" exact>
					<InvitationSignUp />
				</Route>
			</Router>
		</div>
	);
}

export default App;
