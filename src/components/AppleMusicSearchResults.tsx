import useTrackSearch from '../hooks/useTrackSearch';
import PageLoading from './PageLoading';
import TracksApi, { type AppleMusicSong } from '../api/tracksApi';
import AppleMusicTrackResult from './AppleMusicTrackResult';
import type { NewTrack } from '../types';

async function searchAppleMusic(query: string) {
  const { data } = await TracksApi.searchAppleMusic(query);
  return data?.results?.songs?.data || [];
}

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
  const { results, loading } = useTrackSearch(query, searchAppleMusic);

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
