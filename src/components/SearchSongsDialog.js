import { useMemo, useState } from 'react';
import Button from './Button';
import Checkbox from './Checkbox';
import OpenInput from './inputs/OpenInput';
import StackedList from './StackedList';
import StyledDialog from './StyledDialog';
import { noop } from '../utils/constants';
import useSongs from '../hooks/api/useSongs';
import PageLoading from './PageLoading';
import Alert from './Alert';
import { pluralize } from '../utils/StringUtils';
import useAddSongsToBinder from '../hooks/api/useAddSongsToBinder';
import { useHistory } from 'react-router-dom';

export default function SearchSongsDialog({ open, onCloseDialog, binder }) {
  const router = useHistory();
  const { songs: boundSongs, id } = binder;
  const { data: songs, isLoading, isError, isSuccess } = useSongs();
  const unboundSongs = useMemo(() => {
    if (songs && boundSongs) {
      const boundIds = boundSongs?.map(song => song.id);
      return songs.filter(song => !boundIds.includes(song.id));
    } else {
      return [];
    }
  }, [songs, boundSongs]);

  const { isLoading: isSaving, run: addSongsToBinder } = useAddSongsToBinder({
    onSuccess: () => {
      handleClose();
      router.replace(`/binders/${id}`, null);
    },
  });
  const [songsToAdd, setSongsToAdd] = useState([]);
  const [query, setQuery] = useState('');

  function handleChecked(shouldAdd, song) {
    let songsSet = new Set(songsToAdd);
    if (shouldAdd) {
      songsSet.add(song);
    } else {
      songsSet.delete(song);
    }

    setSongsToAdd(Array.from(songsSet));
  }

  function handleClose() {
    setSongsToAdd([]);
    setQuery('');
    onCloseDialog();
  }

  function handleSave() {
    const songIdsToAdd = songsToAdd.map(song => song.id);
    addSongsToBinder({ songIds: songIdsToAdd, binderId: id });
  }

  const filteredSongs = () => {
    if (query !== '') {
      let lowercasedQuery = query.toLowerCase();
      return (
        unboundSongs?.filter(song =>
          song.name.toLowerCase().includes(lowercasedQuery)
        ) || []
      );
    } else {
      return unboundSongs;
    }
  };

  const songListItems = filteredSongs().map(song => {
    let checked = songsToAdd.includes(song);
    return (
      <div
        key={song.id}
        className="flex items-center px-1 cursor-pointer"
        onClick={() => handleChecked(!checked, song)}
      >
        <Checkbox checked={checked} color="blue" onChange={noop} />
        <span className="ml-4">{song.name}</span>
      </div>
    );
  });

  return (
    <StyledDialog open={open} onCloseDialog={handleClose} borderedTop={false}>
      <div className="pb-2 border-b dark:border-dark-gray-400 mb-7">
        <OpenInput
          placeholder="Search for a specific song"
          value={query}
          onChange={setQuery}
        />
      </div>
      <div className="mb-3 font-semibold">Your song library</div>

      {isLoading && <PageLoading />}
      {isError && (
        <Alert color="red">There was an issue retrieving your songs.</Alert>
      )}
      {isSuccess && (
        <div className="overflow-y-auto max-h-96">
          <StackedList items={songListItems} />
        </div>
      )}

      <div className="flex items-center justify-between mt-6">
        <span className="w-1/2 mr-2">
          <Button
            onClick={handleSave}
            full
            disabled={songsToAdd.length === 0}
            loading={isSaving}
          >
            Add {songsToAdd.length} {pluralize('song', songsToAdd.length)}
          </Button>
        </span>
        <span className="w-1/2 ml-2">
          <Button variant="open" color="black" full onClick={handleClose}>
            Cancel
          </Button>
        </span>
      </div>
    </StyledDialog>
  );
}

SearchSongsDialog.defaultProps = {
  boundSongs: [],
};
