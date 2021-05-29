import "./App.css";
import Content from "./components/Content";
import Navbar from "./components/Navbar";
import Sidenav from "./components/Sidenav";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/Login";
import Editor from "./components/Editor";
import SignUp from "./components/SignUp";
import EmailConfirmationSuccess from "./components/EmailConfirmationSuccess";
import TeamLogin from "./components/TeamLogin";
import CreateNewTeam from "./components/CreateNewTeam";
import ClaimInvitation from "./components/ClaimInvitation";
import InvitationSignUp from "./components/InvitationSignUp";

function App() {
	return (
		<div>
			<Router>
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
				<Route path="/editor" exact>
					<Editor />
				</Route>
				<Route path="/app">
					<Sidenav />
					<Navbar />
					<Content />
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
