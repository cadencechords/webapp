import "./App.css";
import Content from "./components/Content";
import Navbar from "./components/Navbar";
import Sidenav from "./components/Sidenav";

function App() {
	return (
		<div>
			<Sidenav />
			<Navbar />
			<Content />
		</div>
	);
}

export default App;
