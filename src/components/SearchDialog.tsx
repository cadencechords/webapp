import { useCallback, useState } from 'react';

import BinderApi from '../api/BinderApi';
import OpenInput from './inputs/OpenInput';
import SearchResults from './SearchResults';
import SetlistApi from '../api/SetlistApi';
import SongApi from '../api/SongApi';
import StyledDialog from './StyledDialog';
import _ from 'lodash';
import { reportError } from '../utils/error';
import type { Binder, Setlist, Song } from '../types';

type SearchResultsData = {
  binders: Binder[];
  songs: Song[];
  setlists: Setlist[];
};

type SearchDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
};

export default function SearchDialog({
  open,
  onCloseDialog,
}: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultsData | null>(
    null
  );

  // oxlint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce(async (nameToSearchFor: string) => {
      if (nameToSearchFor && nameToSearchFor !== '') {
        const results: SearchResultsData = {
          binders: [],
          songs: [],
          setlists: [],
        };
        try {
          const bindersResponse = await BinderApi.search(nameToSearchFor);
          results.binders = bindersResponse.data;

          const songsResponse = await SongApi.search(nameToSearchFor);
          results.songs = songsResponse.data;

          const setlistsResponse = await SetlistApi.search(nameToSearchFor);
          results.setlists = setlistsResponse.data;

          setSearchResults(results);
        } catch (error) {
          reportError(error);
        }
      }
    }, 300),
    []
  );

  const handleSearchQueryChange = (newQuery: string) => {
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
