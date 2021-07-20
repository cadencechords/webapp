import { useEffect, useState } from "react";
import _ from "lodash";
import { useCallback } from "react";
import BarLoader from "react-spinners/BarLoader";

import SetlistApi from "../api/SetlistApi";
import BinderApi from "../api/BinderApi";
import SongApi from "../api/SongApi";
import PageTitle from "./PageTitle";
import SearchResults from "./SearchResults";
import WellInput from "./inputs/WellInput";

export default function SearchPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [searching, setSearching] = useState(false);
	const [searchResults, setSearchResults] = useState(null);

	useEffect(() => {
		document.title = "Search";
	}, []);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debounce = useCallback(
		_.debounce(async (nameToSearchFor) => {
			if (nameToSearchFor && nameToSearchFor !== "") {
				let results = { binders: [], songs: [], setlists: [] };
				try {
					setSearching(true);
					let bindersResponse = await BinderApi.search(nameToSearchFor);
					results.binders = bindersResponse.data;

					let songsResponse = await SongApi.search(nameToSearchFor);
					results.songs = songsResponse.data;

					let setlistsResponse = await SetlistApi.search(nameToSearchFor);
					results.setlists = setlistsResponse.data;

					setSearchResults(results);
				} catch (error) {
					console.log(error);
				} finally {
					setSearching(false);
				}
			}
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
			<div className="fixed bottom-12 md:bottom-0 w-full left-0">
				<BarLoader
					color="#1D4ED8"
					css="display: block"
					width="100%"
					height={3}
					loading={searching}
				/>
			</div>
			<WellInput
				placeholder="Search for binders, sets, songs..."
				value={searchQuery}
				onChange={handleSearchQueryChange}
				autoFocus
			/>

			<SearchResults results={searchResults} />
			<div></div>
		</>
	);
}
