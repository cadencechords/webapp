import AccountShortcut from "./AccountShortcut";
import SearchBar from "./SearchBar";

export default function Navbar() {
	return (
		<nav className="hidden md:flex md:ml-52 px-4 border-b h-16  items-center justify-between">
			<SearchBar />
			<AccountShortcut />
		</nav>
	);
}
