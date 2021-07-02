import { useState } from "react";
import WellInput from "./inputs/WellInput";
import PageTitle from "./PageTitle";
import SearchResults from "./SearchResults";
import _ from "lodash";
import { useCallback } from "react";

export default function SearchPage() {
	const [searchQuery, setSearchQuery] = useState("");

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debounce = useCallback(
		_.debounce((newQuery) => {
			console.log(newQuery);
			// api call later
		}, 300),
		[]
	);

	const handleSearchQueryChange = (newQuery) => {
		setSearchQuery(newQuery);
		debounce(newQuery);
	};

	return (
		<>
			<PageTitle title="Search" />
			<WellInput
				placeholder="Search for binders, sets, songs..."
				value={searchQuery}
				onChange={handleSearchQueryChange}
			/>

			<div className="mt-10">
				{searchQuery === "" ? (
					<div className="text-center px-4 text-gray-600">
						Try typing in the search bar to find something in your library
					</div>
				) : (
					<SearchResults />
				)}
			</div>
		</>
	);
}
