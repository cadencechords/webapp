import { useState } from 'react';

import BinderApi from '../api/BinderApi';
import OpenInput from './inputs/OpenInput';
import SearchResults from './SearchResults';
import SetlistApi from '../api/SetlistApi';
import SongApi from '../api/SongApi';
import StyledDialog from './StyledDialog';
import useDebouncedCallback from '../hooks/useDebouncedCallback';
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

  const debounce = useDebouncedCallback(
    async (nameToSearchFor: string) => {
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
    },
    300,
    'cancel'
  );

  const handleSearchQueryChange = (newQuery: string) => {
    setSearchQuery(newQuery);
    debounce(newQuery);
  };

  const handleCloseDialog = () => {
    // A search still waiting would bring the results back after the clear.
    debounce.cancel();
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
      <div className="pb-4 border-b border-outline-variant">
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
