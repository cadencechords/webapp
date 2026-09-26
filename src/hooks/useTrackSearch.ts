import { useEffect, useState } from 'react';
import { reportError } from '../utils/error';

/**
 * Searches for `query` 800ms after it stops changing. `loading` is true from
 * the moment the query changes until that query's search settles (an empty
 * query isn't searched, so it stays loading). A search that settles after the
 * query has changed again is ignored.
 *
 * `search` must keep its identity between renders (define it outside the
 * component), or every render starts a new search.
 */
export default function useTrackSearch<Result>(
  query: string,
  search: (query: string) => Promise<Result[]>
) {
  const [results, setResults] = useState<Result[]>([]);
  // The query `results` belong to; null before any search settles.
  const [searchedQuery, setSearchedQuery] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const id = setTimeout(async () => {
      if (!query) return;
      try {
        const found = await search(query);
        if (!ignore) setResults(found);
      } catch (error) {
        reportError(error);
      } finally {
        if (!ignore) setSearchedQuery(query);
      }
    }, 800);

    return () => {
      ignore = true;
      clearTimeout(id);
    };
  }, [query, search]);

  return { results, loading: query !== searchedQuery };
}
