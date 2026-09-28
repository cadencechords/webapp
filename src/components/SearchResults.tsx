import type { ReactNode } from 'react';
import Highlighter from 'react-highlight-words';
import { Link } from 'react-router-dom';
import KeyBadge from './KeyBadge';
import { Cookie } from './NoDataMessage';
import { LIST_ITEM, LIST_ITEM_INTERACTIVE } from './lists/listItem';
import { hasAnyKeysSet } from '../utils/SongUtils';
import type { Binder, Setlist, Song } from '../types';

type SearchResultsProps = {
  /** Null until the first search. */
  results?: { binders: Binder[]; songs: Song[]; setlists: Setlist[] } | null;
  onCloseDialog?: () => void;
  searchQuery: string;
  /** Spacing for the prompt shown before the first search. */
  emptyClassName?: string;
};

type Result = { id: number | string; name: string; to: string; key?: string };

// Search results as an M3 sectioned list: a subheader per kind (folders,
// songs, sets) over a segmented group of one-line items, with the query
// picked out in each name.
export default function SearchResults({
  results,
  onCloseDialog,
  searchQuery,
  emptyClassName = 'mt-10',
}: SearchResultsProps) {
  if (!results) {
    return (
      <div
        className={`flex flex-col items-center gap-3 px-4 text-center text-body-medium text-on-surface-variant ${emptyClassName}`}
      >
        <Cookie
          filled
          className="w-16 h-16"
          iconClassName="w-8 h-8"
          icon="search"
        />
        Try typing in the search bar to find something in your library
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-6">
      <ResultSection
        title="Folders"
        empty="No folders found"
        query={searchQuery}
        onSelect={onCloseDialog}
        results={results.binders.map(binder => ({
          id: binder.id,
          name: binder.name,
          to: `/folders/${binder.id}`,
        }))}
      />
      <ResultSection
        title="Songs"
        empty="No songs found"
        query={searchQuery}
        onSelect={onCloseDialog}
        results={results.songs.map(song => ({
          id: song.id,
          name: song.name,
          to: `/songs/${song.id}`,
          key: hasAnyKeysSet(song)
            ? song.transposed_key || song.original_key
            : undefined,
        }))}
      />
      <ResultSection
        title="Sets"
        empty="No sets found"
        query={searchQuery}
        onSelect={onCloseDialog}
        results={results.setlists.map(setlist => ({
          id: setlist.id,
          name: setlist.name,
          to: `/sets/${setlist.id}`,
        }))}
      />
    </div>
  );
}

function ResultSection({
  title,
  empty,
  query,
  onSelect,
  results,
}: {
  title: string;
  empty: string;
  query: string;
  onSelect?: () => void;
  results: Result[];
}) {
  return (
    <section aria-label={title}>
      <h3 className="px-4 pb-2 font-plain text-title-small text-on-surface">
        {title}
      </h3>
      {results.length === 0 ? (
        <NoResults>{empty}</NoResults>
      ) : (
        <div className="list-segmented">
          {results.map(result => (
            <Link
              key={result.id}
              to={result.to}
              onClick={onSelect}
              className={`${LIST_ITEM} ${LIST_ITEM_INTERACTIVE}`}
            >
              {/* Grouped so the row's gap doesn't widen the space before the key. */}
              <span className="flex items-center min-w-0">
                <span className="min-w-0 truncate">
                  <Highlighter
                    searchWords={[query]}
                    // The query is plain text: "(" or "[" isn't a pattern.
                    autoEscape
                    textToHighlight={result.name}
                    highlightClassName="bg-transparent text-primary font-semibold"
                  />
                </span>
                <KeyBadge songKey={result.key} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

// A section with no matches: one plain line, no icon.
function NoResults({ children }: { children: ReactNode }) {
  return (
    <p className="px-4 py-2 text-body-medium text-on-surface-variant">
      {children}
    </p>
  );
}
