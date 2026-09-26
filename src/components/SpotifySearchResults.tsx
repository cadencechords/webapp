import React, { useEffect, useState } from 'react';
import { reportError } from '../utils/error';
import PageLoading from './PageLoading';
import TracksApi, { type SpotifyTrack } from '../api/tracksApi';
import SpotifyTrackResult from './SpotifyTrackResult';
import type { NewTrack } from '../types';

type SpotifySearchResultsProps = {
  query: string;
  onTrackClick: (track: NewTrack, selected: boolean) => void;
  selectedTracks: NewTrack[];
};

export default function SpotifySearchResults({
  query,
  onTrackClick,
  selectedTracks,
}: SpotifySearchResultsProps) {
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => {
      async function search() {
        try {
          const { data } = await TracksApi.searchSpotify(query);
          setResults(data?.tracks?.items || []);
        } catch (error) {
          reportError(error);
        } finally {
          setLoading(false);
        }
      }
      if (query) {
        search();
      }
    }, 800);

    return () => clearTimeout(id);
  }, [query]);

  function isSelected(resultInQuestion: SpotifyTrack) {
    return !!selectedTracks.find(
      selectedTrack =>
        selectedTrack.external_id === resultInQuestion.id &&
        selectedTrack.source === 'Spotify'
    );
  }

  return (
    <div className="my-4">
      {loading ? (
        <PageLoading />
      ) : (
        results.map(result => (
          <SpotifyTrackResult
            track={result}
            key={result.id}
            onClick={onTrackClick}
            selected={isSelected(result)}
          />
        ))
      )}
    </div>
  );
}
