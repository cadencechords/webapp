import useTrackSearch from '../hooks/useTrackSearch';
import PageLoading from './PageLoading';
import TracksApi, { type YouTubeVideo } from '../api/tracksApi';
import YouTubeTrackResult from './YouTubeTrackResult';
import type { NewTrack } from '../types';

async function searchYoutube(query: string) {
  const { data } = await TracksApi.searchYoutube(query);
  return data?.items || [];
}

type YouTubeSearchResultsProps = {
  query: string;
  onTrackClick: (track: NewTrack, selected: boolean) => void;
  selectedTracks: NewTrack[];
};

export default function YouTubeSearchResults({
  query,
  onTrackClick,
  selectedTracks,
}: YouTubeSearchResultsProps) {
  const { results, loading } = useTrackSearch(query, searchYoutube);

  function isSelected(resultInQuestion: YouTubeVideo) {
    return !!selectedTracks.find(
      selectedTrack =>
        // Non-null: YouTube search results always have an id; like before,
        // one without would throw here.
        selectedTrack.external_id === resultInQuestion.id!.videoId &&
        selectedTrack.source === 'YouTube'
    );
  }

  return (
    <div className="my-4">
      {loading ? (
        <PageLoading />
      ) : (
        results.map(result => (
          <YouTubeTrackResult
            track={result}
            // Non-null: as in isSelected.
            key={result.id!.videoId}
            onClick={onTrackClick}
            selected={isSelected(result)}
          />
        ))
      )}
    </div>
  );
}
