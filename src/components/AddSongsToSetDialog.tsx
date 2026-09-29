import { useState } from 'react';
import { useParams } from 'react-router';
import AddSongsDialog from './AddSongsDialog';
import SetlistApi from '../api/SetlistApi';
import { reportError } from '../utils/error';
import type { Song } from '../types';

type AddSongsToSetDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
  onAdded: (addedSongs: Song[]) => void;
  /** The set's songs, left out of the list. */
  boundSongs?: Song[];
};

// AddSongsDialog, adding to the routed set.
export default function AddSongsToSetDialog({
  open,
  onCloseDialog,
  onAdded,
  boundSongs,
}: AddSongsToSetDialogProps) {
  const [adding, setAdding] = useState(false);
  // The route's path declares :id, which useParams can't see.
  const id = useParams<{ id: string }>().id;

  const handleAdd = async (songs: Song[]) => {
    setAdding(true);
    try {
      // Non-null: addSongs returns undefined only for no songs, and Add is
      // disabled until one is picked.
      const { data } = (await SetlistApi.addSongs(
        id,
        songs.map(song => song.id)
      ))!;
      onAdded(data);
      onCloseDialog();
    } catch (error) {
      reportError(error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <AddSongsDialog
      open={open}
      onCloseDialog={onCloseDialog}
      excludedSongs={boundSongs}
      onAdd={handleAdd}
      adding={adding}
    />
  );
}
