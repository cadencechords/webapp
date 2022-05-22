import KeyBadge from "./KeyBadge";
import { Link } from "react-router-dom";
import NoDataMessage from "./NoDataMessage";
import SearchResult from "./SearchResult";
import { hasAnyKeysSet } from "../utils/SongUtils";

export default function SearchResults({ results, onCloseDialog }) {
  if (results) {
    let binders = results.binders?.map((binder) => (
      <Link to={`/binders/${binder.id}`} key={binder.id}>
        <SearchResult onClick={onCloseDialog}>{binder.name}</SearchResult>
      </Link>
    ));
    let songs = results.songs?.map((song) => (
      <Link
        to={`/songs/${song.id}`}
        className="border-b last:border-0"
        key={song.id}
      >
        <SearchResult onClick={onCloseDialog}>
          {song.name}
          {hasAnyKeysSet(song) && (
            <KeyBadge songKey={song.transposed_key || song.original_key} />
          )}
        </SearchResult>
      </Link>
    ));
    let setlists = results.setlists?.map((setlist) => (
      <Link
        to={`/sets/${setlist.id}`}
        className="border-b last:border-0"
        key={setlist.id}
      >
        <SearchResult onClick={onCloseDialog}>{setlist.name}</SearchResult>
      </Link>
    ));
    return (
      <div className="mt-4 px-2 max-h-96 overflow-y-auto">
        <section className="mb-4">
          <h3 className="font-semibold mb-1 dark:text-dark-gray-100">
            Binders
          </h3>
          {binders.length === 0 ? (
            <NoDataMessage>No binders found</NoDataMessage>
          ) : (
            binders
          )}
        </section>
        <section className="mb-4">
          <h3 className="font-semibold mb-1 dark:text-dark-gray-100">Songs</h3>
          {songs.length === 0 ? (
            <NoDataMessage>No songs found</NoDataMessage>
          ) : (
            songs
          )}
        </section>
        <section>
          <h3 className="font-semibold mb-1 dark:text-dark-gray-100">Sets</h3>
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
      <div className="text-center px-4 text-gray-600 dark:text-dark-gray-200 mt-10">
        Try typing in the search bar to find something in your library
      </div>
    );
  }
}
