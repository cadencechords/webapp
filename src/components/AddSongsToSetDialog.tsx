import { useEffect, useState } from 'react';

import AddCancelActions from './buttons/AddCancelActions';
import Checkbox from './Checkbox';
import KeyBadge from './KeyBadge';
import SetlistApi from '../api/SetlistApi';
import SongApi from '../api/SongApi';
import StackedList from './StackedList';
import StyledDialog from './StyledDialog';
import WellInput from './inputs/WellInput';
import { hasAnyKeysSet } from '../utils/SongUtils';
import { noop } from '../utils/constants';
import { reportError } from '../utils/error';
import { useParams } from 'react-router';
import type { Song } from '../types';

type AddSongsToSetDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
  onAdded: (addedSongs: Song[]) => void;
  /** The set's songs, left out of the list. */
  boundSongs?: Song[];
};

export default function AddSongsToSetDialog({
  open,
  onCloseDialog,
  onAdded,
  boundSongs,
}: AddSongsToSetDialogProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [songsToAdd, setSongsToAdd] = useState<Song[]>([]);
  const [query, setQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [savingAdds, setSavingAdds] = useState(false);

  // The route's path declares :id, which useParams can't see.
  const id = useParams<{ id: string }>().id;

  useEffect(() => {
    async function fetchSongs() {
      if (open) {
        try {
          const { data } = await SongApi.getAll();
          // Non-null: kept as before; the set's songs have loaded by the time
          // the dialog opens, and a missing list throws into reportError.
          const boundSongIds = boundSongs!.map(boundSong => boundSong.id);
          const unboundSongs = data.filter(
            song => !boundSongIds.includes(song.id)
          );
          setSongs(unboundSongs);
        } catch (error) {
          reportError(error);
        }
      }
    }

    fetchSongs();
  }, [open, boundSongs]);

  useEffect(() => {
    setFilteredSongs(
      songs.filter(song =>
        song.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, songs]);

  const handleChecked = (shouldAdd: boolean, song: Song) => {
    const songsSet = new Set(songsToAdd);
    if (shouldAdd) {
      songsSet.add(song);
    } else {
      songsSet.delete(song);
    }

    setSongsToAdd(Array.from(songsSet));
  };

  const clearFields = () => {
    setSongs([]);
    setSongsToAdd([]);
    setQuery('');
    setFilteredSongs([]);
  };

  const handleCloseDialog = () => {
    clearFields();
    onCloseDialog();
  };

  const songListItems = filteredSongs.map(song => {
    const isChecked = songsToAdd.includes(song);
    return (
      <div
        key={song.id}
        className="flex cursor-pointer"
        onClick={() => handleChecked(!isChecked, song)}
      >
        <Checkbox checked={isChecked} color="blue" onChange={noop} />
        <span className="ml-4">
          {song.name}{' '}
          {hasAnyKeysSet(song) && (
            <KeyBadge songKey={song.transposed_key || song.original_key} />
          )}
        </span>
      </div>
    );
  });

  const handleSaveAdds = async () => {
    setSavingAdds(true);
    try {
      const songIdsToAdd = songsToAdd.map(song => song.id);
      // Non-null: addSongs returns undefined only for no songs, and Add is
      // disabled until one is picked.
      const { data } = (await SetlistApi.addSongs(id, songIdsToAdd))!;
      onAdded(data);
      handleCloseDialog();
    } catch (error) {
      reportError(error);
    } finally {
      setSavingAdds(false);
    }
  };

  return (
    <StyledDialog
      title="Add songs to this set"
      open={open}
      onCloseDialog={handleCloseDialog}
    >
      <div className="mb-4">
        <WellInput onChange={setQuery} value={query} />
      </div>
      <StackedList
        className="max-h-80 md:max-h-96 overflow-y-auto mb-2"
        items={songListItems}
      />
      <AddCancelActions
        addText={
          songsToAdd.length !== 1
            ? `Add ${songsToAdd.length} songs`
            : 'Add 1 song'
        }
        onCancel={handleCloseDialog}
        loadingAdd={savingAdds}
        onAdd={handleSaveAdds}
        addDisabled={songsToAdd.length === 0}
      />
    </StyledDialog>
  );
}
