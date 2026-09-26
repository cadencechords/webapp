import React, { useEffect, useState } from 'react';
import { reportError } from '../utils/error';
import PageLoading from './PageLoading';
import TracksApi, { type AppleMusicSong } from '../api/tracksApi';
import AppleMusicTrackResult from './AppleMusicTrackResult';
import type { NewTrack } from '../types';

type AppleMusicSearchResultsProps = {
  query: string;
  onTrackClick: (track: NewTrack, selected: boolean) => void;
  selectedTracks: NewTrack[];
};

export default function AppleMusicSearchResults({
  query,
  onTrackClick,
  selectedTracks,
}: AppleMusicSearchResultsProps) {
  const [results, setResults] = useState<AppleMusicSong[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => {
      async function search() {
        try {
          const { data } = await TracksApi.searchAppleMusic(query);
          setResults(data?.results?.songs?.data || []);
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

  function isSelected(resultInQuestion: AppleMusicSong) {
    return !!selectedTracks.find(
      selectedTrack =>
        selectedTrack.external_id === resultInQuestion.id &&
        selectedTrack.source === 'Apple Music'
    );
  }

  return (
    <div className="my-4">
      {loading ? (
        <PageLoading />
      ) : (
        results.map(result => (
          <AppleMusicTrackResult
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
