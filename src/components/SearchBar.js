import SearchDialog from "./SearchDialog";
import SearchIcon from "@heroicons/react/outline/SearchIcon";
import { useState } from "react";

export default function SearchBar() {
	const [isSearching, setIsSearching] = useState(false);

	return (
		<div className="ml-5 flex items-center">
			<SearchIcon className="h-4 w-4 text-gray-500" />
			<span className="ml-4 w-60">
				<button
					className="outline-none focus:outline-none text-gray-500 w-full text-left p-2"
					onClick={() => setIsSearching(true)}
				>
					Search library
				</button>
			</span>

			<SearchDialog open={isSearching} onCloseDialog={() => setIsSearching(false)} />
		</div>
	);
}
