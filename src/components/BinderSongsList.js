import Button from './Button';
import { EDIT_BINDERS } from '../utils/constants';
import NoDataMessage from './NoDataMessage';
import PlusCircleIcon from '@heroicons/react/solid/PlusCircleIcon';
import SearchSongsDialog from './SearchSongsDialog';
import SectionTitle from './SectionTitle';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import useDialog from '../hooks/useDialog';
import List from './List';
import BinderSongRow from './BinderSongRow';
import { useState } from 'react';
import { useMemo } from 'react';
import { useCallback } from 'react';
import WellInput from './inputs/WellInput';

export default function BinderSongsList({ binder }) {
  const [isSearchOpen, showSearch, hideSearch] = useDialog();
  const currentMember = useSelector(selectCurrentMember);
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
      <div className="flex-between">
        <SectionTitle title="Songs in this binder" />
        {currentMember.can(EDIT_BINDERS) && (
          <div className="hidden sm:block">
            <Button
              variant="open"
              size="xs"
              onClick={showSearch}
              bold
              color="blue"
            >
              Add Songs
            </Button>
          </div>
        )}
      </div>

      <List
        ListHeader={
          <>
            <div className="mb-2 text-sm">{binder.songs?.length} total</div>
            <WellInput
              placeholder="Search songs in binder"
              value={query}
              onChange={setQuery}
              className="mb-4 lg:text-sm"
            />
          </>
        }
        ListEmpty={<NoDataMessage>No songs to show</NoDataMessage>}
        data={queriedSongs}
        renderItem={song => (
          <BinderSongRow song={song} key={song.id} binderId={binder.id} />
        )}
      />

      <SearchSongsDialog
        open={isSearchOpen}
        onCloseDialog={hideSearch}
        binder={binder}
      />
      <Button
        variant="open"
        className="fixed left-0 h-12 bg-white rounded-none dark:bg-dark-gray-700 bottom-12 flex-center sm:hidden"
        full
        style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px -5px 17px 0px' }}
        onClick={showSearch}
      >
        <PlusCircleIcon className="w-4 h-4 mr-2" />
        Add more songs
      </Button>
    </>
  );
}
