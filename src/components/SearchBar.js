import SearchIcon from "@heroicons/react/outline/SearchIcon";
import { useState } from "react";
import OpenInput from "./inputs/OpenInput";
import SearchDialog from "./SearchDialog";

export default function SearchBar() {
	const [isSearching, setIsSearching] = useState(false);

	return (
		<div className="ml-5 flex items-center">
			<SearchIcon className="h-4 w-4 text-gray-500" />
			<span className="ml-4 w-60">
				<OpenInput placeholder="Search library" onFocus={() => setIsSearching(true)} value="" />
			</span>

			<SearchDialog open={isSearching} onCloseDialog={() => setIsSearching(false)} />
		</div>
	);
}
