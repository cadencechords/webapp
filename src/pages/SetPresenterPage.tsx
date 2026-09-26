import { Link, useParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../components/Button';
import CenteredPage from '../components/CenteredPage';
import NoDataMessage from '../components/NoDataMessage';
import PageLoading from '../components/PageLoading';
import SetPresenterBottomSheet from '../components/SetPresenterBottomSheet';
import SetPresenterTopBar from '../components/SetPresenterTopBar';
import SetlistAdjustmentsDrawer from '../components/SetlistAdjustmentsDrawer';
import SetlistApi from '../api/SetlistApi';
import SetlistNavigation from '../components/SetlistNavigation';
import SongsCarousel from '../components/SongsCarousel';
import { reportError } from '../utils/error';
import { selectSetlistBeingPresented } from '../store/presenterSlice';
import { setSetlistBeingPresented } from '../store/presenterSlice';
import { useState } from 'react';
import { isEmpty } from 'lodash';
import { useHistory } from 'react-router-dom';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import SessionsApi from '../api/sessionsApi';
import SessionsProvider, {
  useSessionsContext,
} from '../contexts/SessionsProvider';
import useQuery from '../hooks/useQuery';
import notesApi from '../api/notesApi';
import { useCurrentUser } from '../hooks/api/currentUser.hooks';
import AddMarkingsModal from '../components/AddMarkingsModal';
import AnnotationsToolbar from '../components/AnnotationsToolbar';
import usePerformanceMode from '../hooks/usePerformanceMode';
import classNames from 'classnames';
import type { AxiosError } from 'axios';
import type { PresentedSong } from '../store/presenterSlice';
import type { SetPresenterSheet } from '../components/SetPresenterBottomSheet';
import type { Marking, Setlist } from '../types';

export default function Page() {
  return (
    <SessionsProvider>
      <SetPresenter />
    </SessionsProvider>
  );
}

function SetPresenter() {
  const { isPerforming, isAnnotating } = usePerformanceMode();
  const defaultSessionId = useQuery().get('session_id');
  const setlist = useSelector(selectSetlistBeingPresented);
  const [songs, setSongs] = useState<PresentedSong[]>([]);
  const [songBeingViewedIndex, setSongBeingViewedIndex] = useState(0);
  const { id } = useParams<{ id: string }>();
  const router = useHistory();
  const dispatch = useDispatch();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [bottomSheet, setBottomSheet] = useState<SetPresenterSheet | ''>('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAddMarkingsVisible, setIsAddMarkingsVisible] = useState(false);
  // Non-null: kept as before. SecuredRoutes renders pages once the team is
  // set, and the subscription is dispatched right after it.
  const currentSubscription = useSelector(selectCurrentSubscription)!;
  const {
    initializeHostSessionIfExists,
    onSongChange,
    setSessions,
    activeSessionDetails,
    onTryToJoinAsMember,
  } = useSessionsContext();
  const { data: currentUser } = useCurrentUser({
    onSuccess: ({ format_preferences }) => {
      setSongs(previousSongs =>
        previousSongs.map(song => ({
          ...song,
          format: {
            ...song.format,
            // Non-null: kept as before, this throws for a user without
            // format preferences.
            chords_hidden: format_preferences!.hide_chords,
          },
        }))
      );
    },
  });

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    if (currentSubscription.isPro && !activeSessionDetails.isHost) {
      intervalId = setInterval(async () => {
        try {
          const { data } = await SessionsApi.getActiveSessions(id);
          setSessions(data);
        } catch (error) {
          reportError(error);
        }
      }, 7000);
    }

    return () => clearInterval(intervalId);
  }, [currentSubscription, setSessions, id, activeSessionDetails.isHost]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data } = await SetlistApi.getOne(id);

        document.title = `${data.name} | Sets`;

        if (currentSubscription.isPro) {
          const sessionsResult = await SessionsApi.getActiveSessions(id);
          data.sessions = sessionsResult.data;
        }

        dispatch(setSetlistBeingPresented(data));
      } catch (e) {
        reportError(e);
        // `as` and non-null: kept as before, this reads the axios error's
        // response, and throws for an error without one (a network error).
        if ((e as AxiosError).response!.status === 404) {
          router.push('/sets');
        }
      } finally {
        setLoading(false);
      }
    }

    if (isEmpty(setlist)) {
      fetchData();
    }
  }, [setlist, dispatch, id, router, currentSubscription]);

  useEffect(() => {
    if (!isEmpty(setlist) && currentSubscription.isPro) {
      // `as`: a setlist that isn't `{}` was stored whole, by
      // SetlistDetailPage or fetchData above. Non-null: for a pro team both
      // store its sessions.
      setSessions((setlist as Setlist).sessions!);
      initializeHostSessionIfExists(setlist as Setlist);
    }
  }, [
    setlist,
    currentSubscription,
    initializeHostSessionIfExists,
    setSessions,
  ]);

  useEffect(() => {
    const { activeSession, isHost, socket } = activeSessionDetails;
    if (activeSession && !isHost && socket && currentSubscription.isPro) {
      socket.on(
        'initial data',
        ({
          scrollTop,
          songIndex,
        }: {
          scrollTop: number;
          songIndex: number;
        }) => {
          // Non-null: every document has an <html> element.
          const html = document.querySelector('html')!;
          html.scrollTo({ top: scrollTop });
          setSongBeingViewedIndex(songIndex);
        }
      );

      socket.on('go to song', (newSongIndex: number) =>
        setSongBeingViewedIndex(newSongIndex)
      );
    }
  }, [activeSessionDetails, currentSubscription]);

  useEffect(() => {
    if (setlist?.songs) {
      setSongs(
        setlist.songs.map(song => ({
          ...song,
          show_transposed: Boolean(song.transposed_key),
          show_capo: Boolean(song.capo),
          // Boolean(song.roadmap && ...): false without a roadmap, as before
          // (`undefined > 0`).
          show_roadmap: Boolean(song.roadmap && song.roadmap.length > 0),
        }))
      );
    }
  }, [setlist]);

  useEffect(() => {
    if (currentSubscription.isPro && defaultSessionId && setlist?.sessions) {
      onTryToJoinAsMember(defaultSessionId, setlist.sessions);
    }
  }, [setlist, defaultSessionId, currentSubscription, onTryToJoinAsMember]);

  useEffect(() => {
    return () => {
      activeSessionDetails?.socket?.disconnect();
    };
  }, [activeSessionDetails.socket]);

  function handleSongBeingViewedIndexChange(index: number) {
    if (currentSubscription.isPro) {
      onSongChange(index);
    }
    // Non-null: every document has an <html> element.
    const html = document.querySelector('html')!;
    html.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setSongBeingViewedIndex(index);
  }

  function handleBottomSheetChange(sheet: SetPresenterSheet) {
    setShowDrawer(false);
    setShowBottomSheet(true);
    setBottomSheet(sheet);
  }

  async function handleAddNote() {
    const song = songs[songBeingViewedIndex];
    try {
      const { data } = await notesApi.create(song.id);
      setSongs(currentSongs => {
        return currentSongs.map((song, index) => {
          return index === songBeingViewedIndex
            ? // Non-null: kept as before, this throws for a song without
              // notes.
              { ...song, notes: [...song.notes!, data] }
            : song;
        });
      });
    } catch (error) {
      reportError(error);
    }
  }

  function handleMarkingAdded(marking: Marking) {
    setSongs(currentSongs => {
      return currentSongs.map((song, index) => {
        return index === songBeingViewedIndex
          ? // Non-null: kept as before, this throws for a song without
            // markings.
            { ...song, markings: [...song.markings!, marking] }
          : song;
      });
    });
  }

  const handleSongUpdate = useCallback(
    <K extends keyof PresentedSong>(field: K, value: PresentedSong[K]) => {
      setSongs(currentSongs => {
        return currentSongs.map((song, index) => {
          return index === songBeingViewedIndex
            ? { ...song, [field]: value }
            : song;
        });
      });
    },
    [songBeingViewedIndex]
  );

  if (loading) {
    return <PageLoading />;
  }

  // `setlist?.songs &&`: the same as before, `undefined > 0` is false.
  if (setlist?.songs && setlist.songs.length > 0 && currentUser) {
    return (
      <>
        <SetPresenterTopBar
          song={songs[songBeingViewedIndex]}
          onUpdateSong={handleSongUpdate}
          onShowDrawer={() => setShowDrawer(true)}
          onAddNote={handleAddNote}
          onShowMarkingsModal={() => setIsAddMarkingsVisible(true)}
        />
        <div
          className={classNames(
            'max-w-4xl p-3 mx-auto mb-12 whitespace-pre-wrap',
            isAnnotating && 'select-none'
          )}
        >
          <SongsCarousel
            songs={songs}
            onIndexChange={handleSongBeingViewedIndexChange}
            index={songBeingViewedIndex}
            onSongUpdate={handleSongUpdate}
          />
        </div>

        {isPerforming && (
          <SetlistNavigation
            songs={setlist.songs}
            onIndexChange={handleSongBeingViewedIndexChange}
            index={songBeingViewedIndex}
          />
        )}
        <SetPresenterBottomSheet
          sheet={bottomSheet}
          open={showBottomSheet}
          onClose={() => setShowBottomSheet(false)}
          song={songs[songBeingViewedIndex]}
          onSongUpdate={handleSongUpdate}
        />
        <AddMarkingsModal
          open={isAddMarkingsVisible}
          onClose={() => setIsAddMarkingsVisible(false)}
          song={songs[songBeingViewedIndex]}
          onMarkingAdded={handleMarkingAdded}
        />
        {currentSubscription?.isPro && <AnnotationsToolbar />}
        <SetlistAdjustmentsDrawer
          song={songs[songBeingViewedIndex]}
          open={showDrawer}
          onClose={() => setShowDrawer(false)}
          onSongUpdate={handleSongUpdate}
          onShowBottomSheet={handleBottomSheetChange}
          // `as`: a setlist with songs was stored whole, by SetlistDetailPage
          // or fetchData above.
          setlist={setlist as Setlist}
          currentSongIndex={songBeingViewedIndex}
          onAddNote={handleAddNote}
        />
      </>
    );
  } else {
    return (
      <CenteredPage>
        <NoDataMessage>
          <div className="mb-2">This set has no songs</div>
          <Link to={`/sets/${id}`}>
            <Button>Go back</Button>
          </Link>
        </NoDataMessage>
      </CenteredPage>
    );
  }
}
