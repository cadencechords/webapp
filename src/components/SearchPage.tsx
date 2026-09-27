import { useEffect, useState } from 'react';

import LinearProgress from './feedback/LinearProgress';
import BinderApi from '../api/BinderApi';
import PageTitle from './PageTitle';
import SearchResults from './SearchResults';
import SetlistApi from '../api/SetlistApi';
import SongApi from '../api/SongApi';
import WellInput from './inputs/WellInput';
import useDebouncedCallback from '../hooks/useDebouncedCallback';
import { reportError } from '../utils/error';
import type { Binder, Setlist, Song } from '../types';

type SearchResultsData = {
  binders: Binder[];
  songs: Song[];
  setlists: Setlist[];
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultsData | null>(
    null
  );

  useEffect(() => {
    document.title = 'Search';
  }, []);

  const debounce = useDebouncedCallback(
    async (nameToSearchFor: string) => {
      if (nameToSearchFor && nameToSearchFor !== '') {
        const results: SearchResultsData = {
          binders: [],
          songs: [],
          setlists: [],
        };
        try {
          setSearching(true);
          const bindersResponse = await BinderApi.search(nameToSearchFor);
          results.binders = bindersResponse.data;

          const songsResponse = await SongApi.search(nameToSearchFor);
          results.songs = songsResponse.data;

          const setlistsResponse = await SetlistApi.search(nameToSearchFor);
          results.setlists = setlistsResponse.data;

          setSearchResults(results);
        } catch (error) {
          reportError(error);
        } finally {
          setSearching(false);
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

  return (
    <>
      <PageTitle title="Search" />
      <div className="fixed left-0 w-full bottom-14 md:bottom-0">
        {searching && <LinearProgress />}
      </div>
      <WellInput
        placeholder="Search for binders, sets, songs..."
        value={searchQuery}
        onChange={handleSearchQueryChange}
        autoFocus
      />

      <SearchResults results={searchResults} searchQuery={searchQuery} />
    </>
  );
}
