import { EDIT_SETLISTS, EDIT_SONGS } from '../utils/constants';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import Alert from '../components/Alert';
import Button from '../components/Button';
import CalendarIcon from '@heroicons/react/solid/CalendarIcon';
import ChangeSetlistDateDialog from '../components/ChangeSetlistDateDialog';
import PageLoading from '../components/PageLoading';
import PageTitle from '../components/PageTitle';
import PlayIcon from '@heroicons/react/solid/PlayIcon';
import SetlistApi from '../api/SetlistApi';
import SetlistSongsList from '../components/SetlistSongsList';
import _ from 'lodash';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { setSetlistBeingPresented } from '../store/presenterSlice';
import { toShortDate } from '../utils/DateUtils';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import SetlistSessionsList from '../components/SetlistSessionsList';
import PublicSetlistSection from '../components/PublicSetlistSection';
import SetlistOptionsPopover from '../components/SetlistOptionsPopover';

export default function SetlistDetailPage() {
  const [setlist, setSetlist] = useState();
  const [loading, setLoading] = useState(true);
  const [showChangeDateDialog, setShowChangeDateDialog] = useState(false);
  const router = useHistory();
  const id = useParams().id;
  const currentMember = useSelector(selectCurrentMember);
  const currentSubscription = useSelector(selectCurrentSubscription);
  const dispatch = useDispatch();
  const [errored, setErrored] = useState(false);
  const [sessions, setSessions] = useState([]);

  useEffect(
    () => (document.title = setlist ? setlist.name + ' | Sets' : 'Set'),
    [setlist]
  );

  useEffect(() => {
    async function fetchData() {
      try {
        let result = await SetlistApi.getOne(id);
        setSetlist(result.data);
      } catch (error) {
        reportError(error);
        setErrored(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, currentMember]);

  const handleSongsAdded = songsAdded => {
    setSetlist({ ...setlist, songs: [...setlist.songs, ...songsAdded] });
  };

  const handleSongsReordered = reorderedSongs => {
    setSetlist({ ...setlist, songs: reorderedSongs });
  };

  const handleSongRemoved = songIdToRemove => {
    let filteredSongs = setlist.songs?.filter(
      song => song.id !== songIdToRemove
    );
    setSetlist({ ...setlist, songs: filteredSongs });
  };

  const handleNameChange = newName => {
    setSetlist({ ...setlist, name: newName });
    debounce(newName);
  };

  const handleOpenInPresenter = () => {
    dispatch(setSetlistBeingPresented({ ...setlist, sessions }));
    router.push(`/sets/${id}/present`);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce(newName => {
      try {
        SetlistApi.updateOne({ name: newName }, id);
      } catch (error) {
        reportError(error);
      }
    }, 1000),
    []
  );

  const handleClickDateDialog = () => {
    if (currentMember.can(EDIT_SONGS)) {
      setShowChangeDateDialog(true);
    }
  };

  const handleSessionsChanged = useCallback(updatedSessions => {
    setSessions(updatedSessions);
  }, []);

  const handleJoinSession = session => {
    dispatch(setSetlistBeingPresented({ ...setlist, sessions }));
    router.push(`/sets/${setlist.id}/present?session_id=${session.id}`);
  };

  const handlePublicLinkToggled = newToggleValue => {
    setSetlist({ ...setlist, public_link_enabled: newToggleValue });
  };

  if (loading) {
    return <PageLoading />;
  } else if (errored) {
    return <Alert color="red">Looks like an error occured</Alert>;
  } else {
    return (
      <div className="mt-4">
        <div className="flex-between">
          <PageTitle
            title={setlist?.name}
            editable={currentMember.can(EDIT_SETLISTS)}
            onChange={handleNameChange}
          />
          <SetlistOptionsPopover
            setlist={setlist}
            onPerform={handleOpenInPresenter}
          />
        </div>
        <div
          className="inline-flex items-center flex-grow-0 mb-4 text-gray-500 cursor-pointer"
          onClick={handleClickDateDialog}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span className="h-6 leading-6">
            {toShortDate(setlist?.scheduled_date)}
          </span>
        </div>
        <div className="flex w-full">
          {setlist?.songs?.length > 0 && (
            <>
              <Button
                variant="outlined"
                color="black"
                onClick={handleOpenInPresenter}
                className="mb-2 flex-center md:hidden"
                size="md"
                full
              >
                <PlayIcon className="w-5 h-5 mr-4 text-purple-700 dark:text-purple-500" />
                Perform
              </Button>
              <Button
                variant="outlined"
                color="black"
                onClick={handleOpenInPresenter}
                className="items-center justify-center hidden mb-2 md:flex"
                size="xs"
              >
                <PlayIcon className="w-4 h-4 mr-1 text-purple-700 dark:text-purple-500" />
                Perform
              </Button>
            </>
          )}
        </div>

        <SetlistSongsList
          songs={setlist?.songs}
          onSongsAdded={handleSongsAdded}
          onReordered={handleSongsReordered}
          onSongRemoved={handleSongRemoved}
        />
        {currentSubscription.isPro && (
          <SetlistSessionsList
            setlist={setlist}
            sessions={sessions}
            onSessionsChange={handleSessionsChanged}
            onJoinSession={handleJoinSession}
          />
        )}
        <PublicSetlistSection
          setlist={setlist}
          onChange={handlePublicLinkToggled}
        />
        <ChangeSetlistDateDialog
          open={showChangeDateDialog}
          onCloseDialog={() => setShowChangeDateDialog(false)}
          scheduledDate={setlist?.scheduled_date}
          onDateChanged={newScheduledDate =>
            setSetlist({ ...setlist, scheduled_date: newScheduledDate })
          }
        />
      </div>
    );
  }
}
