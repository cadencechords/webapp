// import { selectSongsCache, setSongsCache } from '../store/cacheSlice';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { ADD_SONGS } from '../utils/constants';
import Button from '../components/Button';
import CreateSongDialog from '../components/CreateSongDialog';
import FadeIn from '../components/FadeIn';
import MobileHeader from '../components/MobileHeader';
import NoDataMessage from '../components/NoDataMessage';
import PageTitle from '../components/PageTitle';
import PlusCircleIcon from '@heroicons/react/solid/PlusCircleIcon';
import QuickAdd from '../components/QuickAdd';
import SongApi from '../api/SongApi';
import SongsList from '../components/SongsList';
import WellInput from '../components/inputs/WellInput';
// import { addToNow } from '../utils/date';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { pluralize } from '../utils/StringUtils';
import useSongs from '../hooks/useSongs';
import PageLoading from '../components/PageLoading';
import Alert from '../components/Alert';

export default function SongsIndexPage() {
  useEffect(() => (document.title = 'Songs'));

  const { data: songs, isLoading, error, isSuccess } = useSongs();
  const [isCreating, setIsCreating] = useState(false);
  const currentMember = useSelector(selectCurrentMember);
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleting, setDeleting] = useState(false);
  // const dispatch = useDispatch();

  const handleSongCreated = newSong => {
    // setSongs(currentSongs => {
    //   dispatch(
    //     setSongsCache({
    //       songs: [newSong, ...currentSongs],
    //       expires: addToNow(30, 'second').getTime(),
    //     })
    //   );
    //   return [newSong, ...currentSongs];
    // });
  };

  function filteredSongs() {
    return songs?.filter(song =>
      song.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  function handleToggleSelect(checked, id) {
    setSelectedIds(currentIds => {
      if (checked) {
        return [...currentIds, id];
      } else {
        return currentIds.filter(idInList => idInList !== id);
      }
    });
  }

  function handleToggleSelectAll(checked) {
    if (checked) {
      const allIds = filteredSongs().map(s => s.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  }

  async function handleDeleteSelected() {
    try {
      setDeleting(true);
      await SongApi.deleteBulk(selectedIds);
      // setSongs(currentSongs =>
      //   currentSongs.filter(s => !selectedIds.includes(s.id))
      // );
      setSelectedIds([]);
    } catch (error) {
      reportError(error);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="hidden sm:block">
        <PageTitle title="Songs" />
      </div>
      <div className="mb-4 h-14 sm:hidden">
        <MobileHeader
          title="Songs"
          className="shadow-inner"
          onAdd={() => setIsCreating(true)}
          canAdd={currentMember.can(ADD_SONGS)}
        />
      </div>
      {songs.length > 0 && (
        <>
          <FadeIn className="pl-2 mb-2">
            <div className="h-8 flex-between">
              <span>{songs.length} total</span>
              <span className="hidden sm:inline">
                {selectedIds?.length > 0 && (
                  <Button
                    size="xs"
                    color="red"
                    onClick={handleDeleteSelected}
                    loading={deleting}
                  >
                    Delete {selectedIds.length}{' '}
                    {pluralize('song', selectedIds.length)}
                  </Button>
                )}
              </span>
            </div>
          </FadeIn>
          <FadeIn className="mb-4 delay-75 lg:text-sm">
            <WellInput
              placeholder="Search your songs"
              value={query}
              onChange={setQuery}
            />
          </FadeIn>
        </>
      )}
      {isLoading && <PageLoading />}
      {error && <Alert>{error}</Alert>}
      {isSuccess && songs.length === 0 && <NoDataMessage type="songs" />}
      {isSuccess && songs.length > 0 && (
        <FadeIn className="mb-10 delay-100">
          <SongsList
            songs={filteredSongs()}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
          />
        </FadeIn>
      )}
      {currentMember.can(ADD_SONGS) && (
        <>
          <div className="hidden sm:block">
            <QuickAdd onAdd={() => setIsCreating(true)} />
          </div>
          <CreateSongDialog
            open={isCreating}
            onCloseDialog={() => setIsCreating(false)}
            onCreate={handleSongCreated}
          />
          <Button
            variant="open"
            className="fixed left-0 h-12 bg-white dark:bg-dark-gray-700 bottom-12 flex-center sm:hidden"
            full
            style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px -5px 17px 0px' }}
            onClick={() => setIsCreating(true)}
          >
            <PlusCircleIcon className="w-4 h-4 mr-2" />
            Add new song
          </Button>
        </>
      )}
    </>
  );
}
