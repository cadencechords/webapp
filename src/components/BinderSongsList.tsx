import Button from './Button';
import Icon from './Icon';
import { EDIT_BINDERS } from '../utils/constants';
import NoDataMessage from './NoDataMessage';
import AddSongsToFolderDialog from './AddSongsToFolderDialog';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import useDialog from '../hooks/useDialog';
import List from './List';
import BinderSongRow from './BinderSongRow';
import { useState } from 'react';
import { useMemo } from 'react';
import { useCallback } from 'react';
import SearchField from './inputs/SearchField';
import type { Binder } from '../types';

type BinderSongsListProps = {
  /**
   * Partial for the render before BinderDetailPage's useUpdates copies the
   * loaded binder, when it's still `{}`.
   */
  binder: Partial<Binder>;
};

export default function BinderSongsList({ binder }: BinderSongsListProps) {
  const [isSearchOpen, showSearch, hideSearch] = useDialog();
  // Non-null: kept as before, this throws if the membership hasn't loaded.
  const currentMember = useSelector(selectCurrentMember)!;
  const [query, setQuery] = useState('');

  const searchSongs = useCallback(() => {
    if (query?.length > 1) {
      return binder.songs?.filter(song =>
        song.name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      return binder.songs;
    }
  }, [query, binder.songs]);

  const queriedSongs = useMemo(() => searchSongs(), [searchSongs]);

  return (
    <>
      {/* The section heading, with an M3E small tonal (tertiary) button. */}
      <div className="mt-8 mb-3 flex-between">
        <h2 className="font-plain text-title-large text-on-surface">Songs</h2>
        {currentMember.can(EDIT_BINDERS) && (
          <Button
            variant="accent"
            color="purple"
            size="sm"
            className="flex-center gap-2"
            onClick={showSearch}
          >
            <Icon name="add" className="w-5 h-5" />
            Add songs
          </Button>
        )}
      </div>

      <div className="mb-2 font-plain text-body-medium text-on-surface-variant">
        {binder.songs?.length} total
      </div>
      <SearchField
        placeholder="Search songs in folder"
        value={query}
        onChange={setQuery}
        className="mb-4"
      />
      <List
        ListEmpty={<NoDataMessage>No songs to show</NoDataMessage>}
        data={queriedSongs}
        renderItem={song => (
          <BinderSongRow
            song={song}
            key={song.id}
            // Non-null: rows come from binder.songs, which loads with the
            // binder's id.
            binderId={binder.id!}
          />
        )}
      />

      <AddSongsToFolderDialog
        open={isSearchOpen}
        onCloseDialog={hideSearch}
        // The dialog opens only from Add songs, once the binder has loaded.
        binder={binder as Binder}
      />
    </>
  );
}
