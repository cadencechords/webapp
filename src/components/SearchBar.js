import SearchIcon from "@heroicons/react/outline/SearchIcon";
import OpenInput from "./OpenInput";

export default function SearchBar() {
	return (
		<div className="ml-5 flex items-center">
			<SearchIcon className="h-4 w-4 text-gray-500" />
			<span className="ml-4 w-60">
				<OpenInput placeholder="Search library (Control + K)" />
			</span>
		</div>
	);
}
