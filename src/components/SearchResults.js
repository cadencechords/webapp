import KeyBadge from './KeyBadge';
import { Link } from 'react-router-dom';
import NoDataMessage from './NoDataMessage';
import SearchResult from './SearchResult';
import { hasAnyKeysSet } from '../utils/SongUtils';

export default function SearchResults({ results, onCloseDialog, searchQuery }) {
  if (results) {
    let binders = results.binders?.map(binder => (
      <Link to={`/binders/${binder.id}`}>
        <SearchResult
          key={binder.name}
          onClick={onCloseDialog}
          query={searchQuery}
          name={binder.name}
        />
      </Link>
    ));
    let songs = results.songs?.map(song => (
      <Link to={`/songs/${song.id}`} className="border-b last:border-0">
        <SearchResult
          key={song.id}
          onClick={onCloseDialog}
          query={searchQuery}
          name={song.name}
        >
          {hasAnyKeysSet(song) && (
            <KeyBadge songKey={song.transposed_key || song.original_key} />
          )}
        </SearchResult>
      </Link>
    ));
    let setlists = results.setlists?.map(setlist => (
      <Link to={`/sets/${setlist.id}`} className="border-b last:border-0">
        <SearchResult
          key={setlist.id}
          onClick={onCloseDialog}
          query={searchQuery}
          name={setlist.name}
        />
      </Link>
    ));
    return (
      <div className="px-2 mt-4 overflow-y-auto max-h-96">
        <section className="mb-4">
          <h3 className="mb-1 font-semibold dark:text-dark-gray-100">
            Binders
          </h3>
          {binders.length === 0 ? (
            <NoDataMessage>No binders found</NoDataMessage>
          ) : (
            binders
          )}
        </section>
        <section className="mb-4">
          <h3 className="mb-1 font-semibold dark:text-dark-gray-100">Songs</h3>
          {songs.length === 0 ? (
            <NoDataMessage>No songs found</NoDataMessage>
          ) : (
            songs
          )}
        </section>
        <section>
          <h3 className="mb-1 font-semibold dark:text-dark-gray-100">Sets</h3>
          {setlists.length === 0 ? (
            <NoDataMessage>No sets found</NoDataMessage>
          ) : (
            setlists
          )}
        </section>
      </div>
    );
  } else {
    return (
      <div className="px-4 mt-10 text-center text-gray-600 dark:text-dark-gray-200">
        Try typing in the search bar to find something in your library
      </div>
    );
  }
}
