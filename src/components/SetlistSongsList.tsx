import { useHistory, useParams } from 'react-router';

import AddSongsToSetDialog from './AddSongsToSetDialog';
import Button from './Button';
import Icon from './Icon';
import DragAndDropTable from './DragAndDropTable';
import { EDIT_SETLISTS } from '../utils/constants';
import NoDataMessage from './NoDataMessage';
import SetlistApi from '../api/SetlistApi';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import type { Id, Song } from '../types';

type SetlistSongsListProps = {
  songs?: Song[];
  onSongsAdded: (addedSongs: Song[]) => void;
  onReordered: (reorderedSongs: Song[]) => void;
  onSongRemoved: (removedSongId: number) => void;
};

export default function SetlistSongsList({
  songs,
  onSongsAdded,
  onReordered,
  onSongRemoved,
}: SetlistSongsListProps) {
  const [showSongsDialog, setShowSongsDialog] = useState(false);
  // The route's path declares :id, which useParams can't see.
  const id = useParams<{ id: string }>().id;
  const router = useHistory();
  // Non-null: kept as before, this throws if the membership hasn't loaded.
  const currentMember = useSelector(selectCurrentMember)!;
  const handleReordered = async (
    reorderedSongs: Song[],
    movedSong: { id: string; newPosition: number }
  ) => {
    reorderedSongs = reorderedSongs.map((reorderedSong, index) => ({
      ...reorderedSong,
      position: index,
    }));
    onReordered(reorderedSongs);

    try {
      const updates = { position: movedSong.newPosition };
      await SetlistApi.updateScheduledSong(
        updates,
        Number.parseInt(movedSong.id),
        id
      );
    } catch (error) {
      reportError(error);
    }
  };

  const handleRemoveSong = async (songIdToRemove: number) => {
    try {
      await SetlistApi.removeSongs(id, [songIdToRemove]);
      onSongRemoved(songIdToRemove);
    } catch (error) {
      reportError(error);
    }
  };

  const handleRouteToSongDetail = (songId: Id) => {
    router.push(`/songs/${songId}`);
  };

  return (
    <>
      {/* The section heading, with an M3E small tonal (tertiary) button. */}
      <div className="mt-8 mb-3 flex-between">
        <h2 className="font-plain text-title-large text-on-surface">Songs</h2>
        {currentMember.can(EDIT_SETLISTS) && (
          <Button
            variant="accent"
            color="purple"
            size="sm"
            className="flex-center gap-2"
            onClick={() => setShowSongsDialog(true)}
          >
            <Icon name="add" className="w-5 h-5" />
            Add songs
          </Button>
        )}
      </div>

      {songs && songs.length > 0 ? (
        <DragAndDropTable
          items={songs}
          onReorder={handleReordered}
          removeable={currentMember.can(EDIT_SETLISTS)}
          onRemove={handleRemoveSong}
          onClick={handleRouteToSongDetail}
          rearrangeable={currentMember.can(EDIT_SETLISTS)}
        />
      ) : (
        <NoDataMessage type="songs" />
      )}

      <AddSongsToSetDialog
        open={showSongsDialog}
        onCloseDialog={() => setShowSongsDialog(false)}
        onAdded={onSongsAdded}
        boundSongs={songs}
      />
    </>
  );
}
