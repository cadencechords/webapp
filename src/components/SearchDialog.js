import { useCallback, useState } from 'react';

import BinderApi from '../api/BinderApi';
import OpenInput from './inputs/OpenInput';
import SearchResults from './SearchResults';
import SetlistApi from '../api/SetlistApi';
import SongApi from '../api/SongApi';
import StyledDialog from './StyledDialog';
import _ from 'lodash';
import { reportError } from '../utils/error';

export default function SearchDialog({ open, onCloseDialog }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce(async nameToSearchFor => {
      if (nameToSearchFor && nameToSearchFor !== '') {
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
          reportError(error);
        }
      }
    }, 300),
    []
  );

  const handleSearchQueryChange = newQuery => {
    setSearchQuery(newQuery);
    debounce(newQuery);
  };

  const handleCloseDialog = () => {
    setSearchQuery('');
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
      <div className="pb-4 border-b dark:border-dark-gray-400">
        <OpenInput
          placeholder="Search for binders, songs or sets"
          onChange={handleSearchQueryChange}
          value={searchQuery}
          autoFocus={true}
        />
      </div>

      <SearchResults
        searchQuery={searchQuery}
        results={searchResults}
        onCloseDialog={handleCloseDialog}
      />
    </StyledDialog>
  );
}
