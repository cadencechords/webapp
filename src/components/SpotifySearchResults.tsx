import useTrackSearch from '../hooks/useTrackSearch';
import PageLoading from './PageLoading';
import TracksApi, { type SpotifyTrack } from '../api/tracksApi';
import SpotifyTrackResult from './SpotifyTrackResult';
import type { NewTrack } from '../types';

async function searchSpotify(query: string) {
  const { data } = await TracksApi.searchSpotify(query);
  return data?.tracks?.items || [];
}

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
  const { results, loading } = useTrackSearch(query, searchSpotify);

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
