import { useHistory } from 'react-router-dom';
import AddSongsDialog from './AddSongsDialog';
import useAddSongsToBinder from '../hooks/api/useAddSongsToBinder';
import type { Binder, Song } from '../types';

type AddSongsToFolderDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
  binder: Binder & { songs?: Song[] };
};

// AddSongsDialog, adding to a folder (a binder).
export default function AddSongsToFolderDialog({
  open,
  onCloseDialog,
  binder,
}: AddSongsToFolderDialogProps) {
  const router = useHistory();
  const { isLoading: adding, run: addSongsToBinder } = useAddSongsToBinder({
    onSuccess: () => {
      onCloseDialog();
      router.replace(`/folders/${binder.id}`, null);
    },
  });

  return (
    <AddSongsDialog
      open={open}
      onCloseDialog={onCloseDialog}
      excludedSongs={binder.songs}
      onAdd={songs =>
        addSongsToBinder({
          binderId: binder.id,
          songIds: songs.map(song => song.id),
        })
      }
      adding={adding}
    />
  );
}
