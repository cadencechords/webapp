import { createContext, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectCredentials, selectCurrentUser } from '../store/authSlice';
import {
  findSessionCurrentUserIsHosting,
  joinSession,
} from '../utils/sessions';
import { toast } from 'react-toastify';
import SessionsApi from '../api/sessionsApi';
import { reportError } from '../utils/error';

export const SessionsContext = createContext();

export default function SessionsProvider(props) {
  const [sessions, setSessions] = useState([]);
  const [activeSessionDetails, setActiveSessionDetails] = useState({
    isHost: false,
    activeSession: null,
    socket: null,
  });

  const currentUser = useSelector(selectCurrentUser);
  const credentials = useSelector(selectCredentials);

  useEffect(
    function setupScrollListener() {
      const { activeSession, isHost, socket } = activeSessionDetails;

      if (activeSession?.id && isHost && socket) {
        document.onscroll = () => {
          socket.emit('perform scroll', {
            scrollTop: window.scrollY,
            sessionId: activeSession.id,
          });
        };
      }

      return function removeScrollListener() {
        document.onscroll = null;
      };
    },
    [activeSessionDetails]
  );

  const initializeHostSessionIfExists = useCallback(
    setlist => {
      const currentSession = findSessionCurrentUserIsHosting(
        currentUser,
        setlist.sessions
      );

      if (currentSession) {
        const initializedSocket = joinSession(currentSession, credentials);
        initializedSocket.emit('perform scroll', {
          scrollTop: 0,
          sessionId: currentSession.id,
        });
        initializedSocket.emit('perform change song', {
          songIndex: 0,
          sessionId: currentSession.id,
        });
        toast.success('Connected to your session', {
          hideProgressBar: true,
          autoClose: 2000,
          pauseOnHover: false,
        });
        setActiveSessionDetails({
          activeSession: currentSession,
          socket: initializedSocket,
          isHost: true,
        });
      }
    },
    [credentials, currentUser]
  );

  async function handleStartSession(setlist, currentSongIndex) {
    try {
      const toastId = toast.loading('Starting session');
      let { data: newSession } = await SessionsApi.startSession(setlist.id);
      const initializedSocket = joinSession(newSession, credentials);

      initializedSocket.emit('perform scroll', {
        scrollTop: window.scrollY,
        sessionId: newSession.id,
      });
      initializedSocket.emit('perform change song', {
        songIndex: currentSongIndex,
        sessionId: newSession.id,
      });

      setActiveSessionDetails({
        socket: initializedSocket,
        isHost: true,
        activeSession: newSession,
      });
      toast.update(toastId, {
        render: 'Session started!',
        isLoading: false,
        hideProgressBar: true,
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      reportError(error);
    }
  }

  async function handleEndSession() {
    const { activeSession, socket } = activeSessionDetails;
    try {
      const id = toast.loading('Ending session');
      await SessionsApi.endSession(activeSession.setlist_id, activeSession.id);
      toast.update(id, {
        render: 'Session ended!',
        isLoading: false,
        hideProgressBar: true,
        pauseOnHover: false,
        autoClose: 2000,
      });
      socket.emit('end session', { sessionId: activeSession.id });
      socket.disconnect();
      setActiveSessionDetails({
        activeSession: null,
        socket: null,
        isHost: false,
      });
    } catch (error) {
      reportError(error);
    }
  }

  function handleSongChange(newIndex) {
    const { activeSession, socket, isHost } = activeSessionDetails;
    if (activeSession && socket && isHost) {
      socket.emit('perform change song', {
        songIndex: newIndex,
        sessionId: activeSession.id,
      });
    }
  }

  const handleJoinAsMember = useCallback(
    session => {
      const initializedSocket = joinSession(session, credentials);

      toast.success('Connected to session', {
        hideProgressBar: true,
        autoClose: 2000,
        pauseOnHover: false,
      });

      initializedSocket.on('scroll to', scrollTop => {
        let html = document.querySelector('html');
        html.scrollTo({
          top: scrollTop,
        });
      });

      initializedSocket.on('host ended session', () => {
        toast('Host ended session', {
          hideProgressBar: true,
          autoClose: 2000,
          pauseOnHover: false,
        });
        setActiveSessionDetails({
          activeSession: null,
          isHost: false,
          socket: null,
        });
      });

      setActiveSessionDetails({
        isHost: false,
        activeSession: session,
        socket: initializedSocket,
      });
    },
    [credentials]
  );

  function handleLeaveAsMember() {
    let { socket } = activeSessionDetails;

    socket.disconnect();
    setActiveSessionDetails({
      socket: null,
      isHost: false,
      activeSession: null,
    });

    toast.success('Left session', {
      hideProgressBar: true,
      autoClose: 2000,
      pauseOnHover: false,
    });
  }

  const handleTryToJoinAsMember = useCallback(
    (sessionId, sessions) => {
      const sessionToConnectTo = sessions.find(
        session => session.id === parseInt(sessionId)
      );

      if (!sessionToConnectTo) return;
      if (sessionToConnectTo.user_id === currentUser.id) return;

      handleJoinAsMember(sessionToConnectTo);
    },
    [handleJoinAsMember, currentUser.id]
  );

  return (
    <SessionsContext.Provider
      {...props}
      value={{
        sessions,
        setSessions,
        activeSessionDetails,
        initializeHostSessionIfExists,
        onStartSession: handleStartSession,
        onEndSession: handleEndSession,
        onSongChange: handleSongChange,
        onJoinAsMember: handleJoinAsMember,
        onLeaveAsMember: handleLeaveAsMember,
        onTryToJoinAsMember: handleTryToJoinAsMember,
      }}
    />
  );
}
