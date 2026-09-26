import Button from './Button';
import { EDIT_BINDERS } from '../utils/constants';
import NoDataMessage from './NoDataMessage';
import SearchSongsDialog from './SearchSongsDialog';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import useDialog from '../hooks/useDialog';
import List from './List';
import BinderSongRow from './BinderSongRow';
import { useState } from 'react';
import { useMemo } from 'react';
import { useCallback } from 'react';
import WellInput from './inputs/WellInput';
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
      <div className="pt-3 mt-8 mb-3 text-lg font-semibold border-t flex-between dark:border-dark-gray-600">
        Songs
        {currentMember.can(EDIT_BINDERS) && (
          <Button size="xs" variant="open" onClick={showSearch}>
            Add Songs
          </Button>
        )}
      </div>

      <div className="mb-2 text-sm">{binder.songs?.length} total</div>
      <WellInput
        placeholder="Search songs in binder"
        value={query}
        onChange={setQuery}
        className="mb-4 lg:text-sm"
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

      <SearchSongsDialog
        open={isSearchOpen}
        onCloseDialog={hideSearch}
        // The dialog opens only from Add Songs, once the binder has loaded.
        binder={binder as Binder}
      />
    </>
  );
}
