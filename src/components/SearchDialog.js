import _ from "lodash";
import { useCallback, useState } from "react";

import OpenInput from "./inputs/OpenInput";
import StyledDialog from "./StyledDialog";
import SetlistApi from "../api/SetlistApi";
import BinderApi from "../api/BinderApi";
import SongApi from "../api/SongApi";
import SearchResults from "./SearchResults";

export default function SearchDialog({ open, onCloseDialog }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState(null);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debounce = useCallback(
		_.debounce(async (nameToSearchFor) => {
			if (nameToSearchFor && nameToSearchFor !== "") {
				let results = { binders: [], songs: [], setlists: [] };
				try {
					let bindersResponse = await BinderApi.search(nameToSearchFor);
					results.binders = bindersResponse.data;

					let songsResponse = await SongApi.search(nameToSearchFor);
					results.songs = songsResponse.data;

					let setlistsResponse = await SetlistApi.search(nameToSearchFor);
					results.setlists = setlistsResponse.data;

					setSearchResults(results);
				} catch (error) {
					console.log(error);
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
		<StyledDialog open={open} onCloseDialog={onCloseDialog} borderedTop={false}>
			<div className="border-b pb-4">
				<OpenInput
					placeholder="Search for binders, lyrics or sets"
					onChange={handleSearchQueryChange}
					value={searchQuery}
				/>
			</div>

			<SearchResults results={searchResults} />
		</StyledDialog>
	);
}
