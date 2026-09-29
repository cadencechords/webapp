import classNames from 'classnames';
import { useMemo, useState } from 'react';
import Alert from './Alert';
import Button from './Button';
import DialogActions from './DialogActions';
import Checkbox from './Checkbox';
import KeyBadge from './KeyBadge';
import PageLoading from './PageLoading';
import SearchField from './inputs/SearchField';
import StyledDialog from './StyledDialog';
import {
  LIST_ITEM,
  LIST_ITEM_INTERACTIVE,
  ON_LOWEST_STATE_LAYERS,
} from './lists/listItem';
import useSongs from '../hooks/api/useSongs';
import { hasAnyKeysSet } from '../utils/SongUtils';
import { pluralize } from '../utils/StringUtils';
import type { Song } from '../types';

type AddSongsDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
  /** Songs already in the set or folder, left out of the list. */
  excludedSongs?: Song[];
  /** Adds the picked songs; the caller closes the dialog when it's done. */
  onAdd: (songs: Song[]) => void;
  /** While the caller adds them. */
  adding?: boolean;
};

// Picks songs from the team's library to add to a set or a folder: a search
// bar, then the songs as a segmented list of checkbox rows (with their keys),
// then Cancel and Add. No header: the search bar leads.
export default function AddSongsDialog({
  open,
  onCloseDialog,
  ...props
}: AddSongsDialogProps) {
  return (
    <StyledDialog
      open={open}
      onCloseDialog={onCloseDialog}
      title="Add songs"
      hideTitle
      showClose={false}
      surface="low-in-dark"
    >
      {/* StyledDialog unmounts this while closed, so each opening starts
          with no query and nothing picked. */}
      <SongPicker onCancel={onCloseDialog} {...props} />
    </StyledDialog>
  );
}

function SongPicker({
  onCancel,
  excludedSongs,
  onAdd,
  adding = false,
}: Omit<AddSongsDialogProps, 'open' | 'onCloseDialog'> & {
  onCancel: () => void;
}) {
  const { data: songs, isLoading, isError, isSuccess } = useSongs();
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<Song[]>([]);

  const available = useMemo(() => {
    const excludedIds = new Set(excludedSongs?.map(song => song.id));
    return songs.filter(song => !excludedIds.has(song.id));
  }, [songs, excludedSongs]);
  const matching = available.filter(song =>
    song.name.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (song: Song) =>
    setPicked(current =>
      current.includes(song)
        ? current.filter(pickedSong => pickedSong !== song)
        : [...current, song]
    );

  return (
    <>
      <SearchField
        placeholder="Search your songs"
        value={query}
        onChange={setQuery}
        surface="lowest"
        autoFocus
        className="mb-4"
      />
      {isLoading && <PageLoading />}
      {isError && (
        <Alert color="red">There was an issue retrieving your songs.</Alert>
      )}
      {isSuccess &&
        (matching.length === 0 ? (
          <p className="px-4 py-3 text-body-medium text-on-surface-variant">
            No songs found
          </p>
        ) : (
          <div className="list-segmented max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
            {matching.map(song => (
              // A label: a click anywhere on the row toggles its checkbox.
              <label
                key={song.id}
                className={classNames(
                  LIST_ITEM,
                  LIST_ITEM_INTERACTIVE,
                  ON_LOWEST_STATE_LAYERS,
                  // Lowest in light mode, higher than the panel in dark.
                  'bg-surface-container-lowest dark:bg-surface-container-high cursor-pointer'
                )}
              >
                <Checkbox
                  checked={picked.includes(song)}
                  onChange={() => toggle(song)}
                />
                <span className="flex items-center min-w-0">
                  <span className="min-w-0 truncate">{song.name}</span>
                  {hasAnyKeysSet(song) && (
                    <KeyBadge
                      songKey={song.transposed_key || song.original_key}
                    />
                  )}
                </span>
              </label>
            ))}
          </div>
        ))}
      <DialogActions
        onCancel={onCancel}
        primary={
          <Button
            variant="open"
            size="sm"
            onClick={() => onAdd(picked)}
            loading={adding}
            disabled={picked.length === 0}
          >
            Add {picked.length} {pluralize('song', picked.length)}
          </Button>
        }
      />
    </>
  );
}
