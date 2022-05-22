import { useCallback, useState } from "react";

import BinderApi from "../api/BinderApi";
import OpenInput from "./inputs/OpenInput";
import SearchResults from "./SearchResults";
import SetlistApi from "../api/SetlistApi";
import SongApi from "../api/SongApi";
import StyledDialog from "./StyledDialog";
import _ from "lodash";

export default function SearchDialog({ open, onCloseDialog }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce((nameToSearchFor) => {
      if (nameToSearchFor && nameToSearchFor !== "") {
        let results = { binders: [], songs: [], setlists: [] };

        let bindersResponse = BinderApi.search(nameToSearchFor);
        results.binders = bindersResponse.data;

        let songsResponse = SongApi.search(nameToSearchFor);
        results.songs = songsResponse.data;

        let setlistsResponse = SetlistApi.search(nameToSearchFor);
        results.setlists = setlistsResponse.data;

        setSearchResults(results);
      }
    }, 300),
    []
  );

  const handleSearchQueryChange = (newQuery) => {
    setSearchQuery(newQuery);
    debounce(newQuery);
  };

  const handleCloseDialog = () => {
    setSearchQuery("");
    setSearchResults(null);
    onCloseDialog();
  };

  return (
    <StyledDialog
      open={open}
      onCloseDialog={handleCloseDialog}
      borderedTop={false}
      showClose={false}
    >
      <div className="border-b dark:border-dark-gray-400 pb-4">
        <OpenInput
          placeholder="Search for binders, songs or sets"
          onChange={handleSearchQueryChange}
          value={searchQuery}
          autoFocus={true}
        />
      </div>

      <SearchResults
        results={searchResults}
        onCloseDialog={handleCloseDialog}
      />
    </StyledDialog>
  );
}
