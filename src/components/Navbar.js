import AccountOptionsPopover from "./AccountOptionsPopover";
import FeedbackPopover from "./FeedbackPopover";
import SearchBar from "./SearchBar";

export default function Navbar() {
	return (
		<nav className="hidden md:flex md:ml-14 lg:ml-52 px-4 border-b h-16  items-center justify-between">
			<SearchBar />
			<span className="flex-center gap-8">
				<FeedbackPopover />
				<AccountOptionsPopover />
			</span>
		</nav>
	);
}
