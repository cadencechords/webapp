import "./App.css";
import Content from "./components/Content";
import Navbar from "./components/Navbar";
import Sidenav from "./components/Sidenav";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/Login";
import Editor from "./components/Editor";
import SignUp from "./components/SignUp";

function App() {
	return (
		<div>
			<Router>
				<Route path="/login" exact>
					<Login />
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
			</Router>
		</div>
	);
}

export default App;
