import { Link, useParams } from 'react-router-dom';
import { useCallback, useContext, useEffect } from 'react';
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
  SessionsContext,
} from '../contexts/SessionsProvider';
import useQuery from '../hooks/useQuery';
import notesApi from '../api/notesApi';
import { useCurrentUser } from '../hooks/api/currentUser.hooks';
import AddMarkingsModal from '../components/AddMarkingsModal';

export default function Page() {
  return (
    <SessionsProvider>
      <SetPresenter />
    </SessionsProvider>
  );
}

function SetPresenter() {
  const defaultSessionId = useQuery().get('session_id');
  const setlist = useSelector(selectSetlistBeingPresented);
  const [songs, setSongs] = useState([]);
  const [songBeingViewedIndex, setSongBeingViewedIndex] = useState(0);
  const { id } = useParams();
  const router = useHistory();
  const dispatch = useDispatch();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [bottomSheet, setBottomSheet] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAddMarkingsVisible, setIsAddMarkingsVisible] = useState(false);
  const currentSubscription = useSelector(selectCurrentSubscription);
  const {
    initializeHostSessionIfExists,
    onSongChange,
    setSessions,
    activeSessionDetails,
    onTryToJoinAsMember,
  } = useContext(SessionsContext);
  const { data: currentUser } = useCurrentUser({
    onSuccess: ({ format_preferences }) => {
      setSongs(previousSongs =>
        previousSongs.map(song => ({
          ...song,
          format: {
            ...song.format,
            chords_hidden: format_preferences.hide_chords,
          },
        }))
      );
    },
  });

  useEffect(() => {
    let intervalId;
    if (currentSubscription.isPro && !activeSessionDetails.isHost) {
      intervalId = setInterval(async () => {
        try {
          let { data } = await SessionsApi.getActiveSessions(id);
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
        let { data } = await SetlistApi.getOne(id);

        document.title = `${data.name} | Sets`;

        if (currentSubscription.isPro) {
          let sessionsResult = await SessionsApi.getActiveSessions(id);
          data.sessions = sessionsResult.data;
        }

        dispatch(setSetlistBeingPresented(data));
      } catch (e) {
        reportError(e);
        if (e.response.status === 404) {
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
      setSessions(setlist.sessions);
      initializeHostSessionIfExists(setlist);
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
      socket.on('initial data', ({ scrollTop, songIndex }) => {
        const html = document.querySelector('html');
        html.scrollTo({ top: scrollTop });
        setSongBeingViewedIndex(songIndex);
      });

      socket.on('go to song', newSongIndex =>
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
          show_roadmap: song.roadmap?.length > 0,
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
    return () => activeSessionDetails?.socket?.disconnect();
  }, [activeSessionDetails.socket]);

  function handleSongBeingViewedIndexChange(index) {
    if (currentSubscription.isPro) {
      onSongChange(index);
    }
    let html = document.querySelector('html');
    html.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setSongBeingViewedIndex(index);
  }

  function handleBottomSheetChange(sheet) {
    setShowDrawer(false);
    setShowBottomSheet(true);
    setBottomSheet(sheet);
  }

  async function handleAddNote() {
    const song = songs[songBeingViewedIndex];
    try {
      let { data } = await notesApi.create(song.id);
      setSongs(currentSongs => {
        return currentSongs.map((song, index) => {
          return index === songBeingViewedIndex
            ? { ...song, notes: [...song.notes, data] }
            : song;
        });
      });
    } catch (error) {
      reportError(error);
    }
  }

  const handleSongUpdate = useCallback(
    (field, value) => {
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

  if (setlist?.songs?.length > 0 && currentUser) {
    return (
      <>
        <SetPresenterTopBar
          song={songs[songBeingViewedIndex]}
          onUpdateSong={handleSongUpdate}
          onShowDrawer={() => setShowDrawer(true)}
          onAddNote={handleAddNote}
          onShowMarkingsModal={() => setIsAddMarkingsVisible(true)}
        />
        <div className="max-w-4xl p-3 mx-auto mb-12 whitespace-pre-wrap">
          <SongsCarousel
            songs={songs}
            onIndexChange={handleSongBeingViewedIndexChange}
            index={songBeingViewedIndex}
            onSongUpdate={handleSongUpdate}
            currentSubscription={currentSubscription}
          />
        </div>

        <SetlistNavigation
          songs={setlist.songs}
          onIndexChange={handleSongBeingViewedIndexChange}
          index={songBeingViewedIndex}
        />
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
        />
        <SetlistAdjustmentsDrawer
          song={songs[songBeingViewedIndex]}
          open={showDrawer}
          onClose={() => setShowDrawer(false)}
          onSongUpdate={handleSongUpdate}
          onShowBottomSheet={handleBottomSheetChange}
          setlist={setlist}
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
