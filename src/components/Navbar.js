import AccountShortcut from "./AccountShortcut";
import SearchBar from "./SearchBar";

export default function Navbar() {
	return (
		<nav className="ml-52 px-4 border-b h-16 flex items-center justify-between">
			<SearchBar />
			<AccountShortcut />
		</nav>
	);
}
