import { useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ADD_SONGS } from '../utils/constants';
import CreateSongDialog from '../components/CreateSongDialog';
import NoDataMessage from '../components/NoDataMessage';
import QuickAdd from '../components/QuickAdd';
import WellInput from '../components/inputs/WellInput';

import { selectCurrentMember } from '../store/authSlice';
import useSongs from '../hooks/api/useSongs';
import PageHeader from '../components/PageHeader';
import PageLoading from '../components/PageLoading';
import Alert from '../components/Alert';
import List from '../components/List';
import SongRow from '../components/SongRow';
import useDialog from '../hooks/useDialog';
import FadeIn from '../components/FadeIn';

export default function SongsIndexPage() {
  useEffect(() => (document.title = 'Songs'));

  const { data: songs, isLoading, isError, isSuccess } = useSongs();
  const [query, setQuery] = useState('');

  const searchSongs = useCallback(() => {
    if (query.length > 2) {
      return songs?.filter(song =>
        song.name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      return songs;
    }
  }, [query, songs]);

  const queriedSongs = useMemo(() => searchSongs(), [searchSongs]);

  const [isCreateOpen, showCreateDialog, closeCreateDialog] = useDialog();
  const currentMember = useSelector(selectCurrentMember);

  return (
    <div className="mb-10">
      <PageHeader title="Songs" headerRightVisible={false} />
      {isLoading && <PageLoading />}
      {isError && (
        <Alert color="red">There was an issue retrieving your songs.</Alert>
      )}

      {isSuccess && (
        <>
          <div className="mb-2">{songs.length} total</div>
          <FadeIn>
            <WellInput
              placeholder="Search your songs"
              value={query}
              onChange={setQuery}
              className="mb-4 lg:text-sm"
            />
          </FadeIn>
          <FadeIn className="delay-100">
            <List
              data={queriedSongs}
              className="delay-100"
              renderItem={song => <SongRow song={song} key={song.id} />}
              ListEmpty={<NoDataMessage type={'songs'} />}
            />
          </FadeIn>
        </>
      )}
      {currentMember.can(ADD_SONGS) && (
        <>
          <QuickAdd onAdd={showCreateDialog} />
          <CreateSongDialog
            open={isCreateOpen}
            onCloseDialog={closeCreateDialog}
          />
        </>
      )}
    </div>
  );
}
