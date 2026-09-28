import Track from './Track';
import Button from './Button';
import AddTracksDialog from '../dialogs/AddTracksDialog';
import { useState } from 'react';
import NoDataMessage from './NoDataMessage';
import Icon from './Icon';
import type { Song, Track as TrackModel } from '../types';

type SongTracksTabProps = {
  song: Song;
  onDeleted: (trackId: number) => void;
  onTracksAdded: (tracks: TrackModel[]) => void;
};

export default function SongTracksTab({
  song,
  onDeleted,
  onTracksAdded,
}: SongTracksTabProps) {
  const [showAddTracks, setShowAddTracks] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-4">
        {/* An M3E small tonal button (tertiary) with a leading icon. */}
        <Button
          variant="accent"
          color="purple"
          size="sm"
          className="flex-center gap-2"
          onClick={() => setShowAddTracks(true)}
        >
          <Icon name="add" className="w-5 h-5" />
          Add track
        </Button>
      </div>
      {song?.tracks?.length === 0 ? (
        <NoDataMessage compact type="tracks" />
      ) : (
        <div className="overflow-x-scroll whitespace-nowrap flex">
          {song?.tracks?.map(track => (
            <Track
              key={track.id}
              track={track}
              songId={song.id}
              onDeleted={onDeleted}
            />
          ))}
        </div>
      )}
      <AddTracksDialog
        open={showAddTracks}
        onCloseDialog={() => setShowAddTracks(false)}
        song={song}
        onTracksAdded={onTracksAdded}
      />
    </>
  );
}
