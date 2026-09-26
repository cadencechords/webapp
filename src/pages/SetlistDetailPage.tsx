import { EDIT_SETLISTS, EDIT_SONGS } from '../utils/constants';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import Alert from '../components/Alert';
import Button from '../components/Button';
import ChangeSetlistDateDialog from '../components/ChangeSetlistDateDialog';
import PageLoading from '../components/PageLoading';
import PageTitle from '../components/PageTitle';
import SetlistApi from '../api/SetlistApi';
import SetlistSongsList from '../components/SetlistSongsList';
import _ from 'lodash';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { setSetlistBeingPresented } from '../store/presenterSlice';
import { format } from '../utils/DateUtils';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import SetlistSessionsList from '../components/SetlistSessionsList';
import PublicSetlistSection from '../components/PublicSetlistSection';
import SetlistOptionsPopover from '../components/SetlistOptionsPopover';
import Icon from '../components/Icon';
import type { Session, Setlist, Song } from '../types';

export default function SetlistDetailPage() {
  const [setlist, setSetlist] = useState<Setlist | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [showChangeDateDialog, setShowChangeDateDialog] = useState(false);
  const router = useHistory();
  // The route's path declares :id, which useParams can't see.
  const id = useParams<{ id: string }>().id;
  // Non-null (both): kept as before, these throw if the team hasn't loaded.
  const currentMember = useSelector(selectCurrentMember)!;
  const currentSubscription = useSelector(selectCurrentSubscription)!;
  const dispatch = useDispatch();
  const [errored, setErrored] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    document.title = setlist ? setlist.name + ' | Sets' : 'Set';
  }, [setlist]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await SetlistApi.getOne(id);
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

  // Non-null (setlist! and setlist!.songs! below): kept as before. The
  // handlers run only from the page rendered once fetchData has set the
  // setlist, and a set loaded by id comes with its songs.
  const handleSongsAdded = (songsAdded: Song[]) => {
    setSetlist({ ...setlist!, songs: [...setlist!.songs!, ...songsAdded] });
  };

  const handleSongsReordered = (reorderedSongs: Song[]) => {
    setSetlist({ ...setlist!, songs: reorderedSongs });
  };

  const handleSongRemoved = (songIdToRemove: number) => {
    const filteredSongs = setlist!.songs?.filter(
      song => song.id !== songIdToRemove
    );
    setSetlist({ ...setlist!, songs: filteredSongs });
  };

  const handleNameChange = (newName: string) => {
    setSetlist({ ...setlist!, name: newName });
    debounce(newName);
  };

  const handleOpenInPresenter = () => {
    dispatch(setSetlistBeingPresented({ ...setlist, sessions }));
    router.push(`/sets/${id}/present`);
  };

  // oxlint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce((newName: string) => {
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

  const handleSessionsChanged = useCallback((updatedSessions: Session[]) => {
    setSessions(updatedSessions);
  }, []);

  const handleJoinSession = (session: Session) => {
    dispatch(setSetlistBeingPresented({ ...setlist, sessions }));
    router.push(`/sets/${setlist!.id}/present?session_id=${session.id}`);
  };

  const handlePublicLinkToggled = (newToggleValue: boolean) => {
    setSetlist({ ...setlist!, public_link_enabled: newToggleValue });
  };

  if (loading) {
    return <PageLoading />;
  } else if (errored) {
    return <Alert color="red">Looks like an error occured</Alert>;
  } else {
    // Non-null (setlist! below): not loading and no error, so fetchData has
    // set the setlist.
    return (
      <div className="mt-4">
        <div className="flex-between">
          <PageTitle
            title={setlist?.name}
            editable={currentMember.can(EDIT_SETLISTS)}
            onChange={handleNameChange}
          />
          <SetlistOptionsPopover
            setlist={setlist!}
            onPerform={handleOpenInPresenter}
          />
        </div>
        <div
          className="inline-flex items-center grow-0 mb-4 text-gray-500 cursor-pointer"
          onClick={handleClickDateDialog}
        >
          <Icon name="calendar_month" filled className="w-4 h-4 mr-2" />
          <span className="h-6 leading-6">
            {format('ddd MMM D', setlist?.scheduled_date)}
          </span>
        </div>
        <div className="flex w-full">
          {setlist?.songs && setlist.songs.length > 0 && (
            <>
              <Button
                variant="accent"
                onClick={handleOpenInPresenter}
                className="mb-2 flex-center md:hidden"
                size="md"
                full
              >
                <Icon name="play_circle" filled className="w-5 h-5 mr-4" />
                Perform
              </Button>
              <Button
                variant="filled"
                onClick={handleOpenInPresenter}
                className="items-center justify-center hidden mb-2 md:flex"
                size="xs"
              >
                <Icon name="play_circle" filled className="w-4 h-4 mr-1.5" />
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
            // Non-null: kept as before; SetlistSessionsList reads the
            // setlist's id straight away.
            setlist={setlist!}
            sessions={sessions}
            onSessionsChange={handleSessionsChanged}
            onJoinSession={handleJoinSession}
          />
        )}
        <PublicSetlistSection
          setlist={setlist!}
          onChange={handlePublicLinkToggled}
        />
        <ChangeSetlistDateDialog
          open={showChangeDateDialog}
          onCloseDialog={() => setShowChangeDateDialog(false)}
          scheduledDate={setlist?.scheduled_date}
          onDateChanged={newScheduledDate =>
            setSetlist({ ...setlist!, scheduled_date: newScheduledDate })
          }
        />
      </div>
    );
  }
}
