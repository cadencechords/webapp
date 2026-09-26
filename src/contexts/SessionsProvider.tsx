import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { selectCredentials, selectCurrentUser } from '../store/authSlice';
import {
  findSessionCurrentUserIsHosting,
  joinSession,
} from '../utils/sessions';
import { toast } from 'react-toastify';
import SessionsApi from '../api/sessionsApi';
import { reportError } from '../utils/error';
import type { Session, Setlist } from '../types';

export interface ActiveSessionDetails {
  /** Whether the current user hosts `activeSession`. */
  isHost: boolean;
  activeSession: Session | null;
  socket: Socket | null;
}

export interface SessionsContextValue {
  /** The setlist's active sessions. */
  sessions: Session[];
  setSessions: Dispatch<SetStateAction<Session[]>>;
  activeSessionDetails: ActiveSessionDetails;
  /** Reconnects to the setlist's session the current user hosts, if any. */
  initializeHostSessionIfExists: (setlist: Setlist) => void;
  onStartSession: (setlist: Setlist, currentSongIndex: number) => Promise<void>;
  onEndSession: () => Promise<void>;
  onSongChange: (newIndex: number) => void;
  onJoinAsMember: (session: Session) => void;
  onLeaveAsMember: () => void;
  /** Joins the session with this id (from the URL) unless the user hosts it. */
  onTryToJoinAsMember: (sessionId: string, sessions: Session[]) => void;
}

export const SessionsContext = createContext<SessionsContextValue | undefined>(
  undefined
);

/** The sessions context. Throws outside a `SessionsProvider`. */
export function useSessionsContext(): SessionsContextValue {
  const value = useContext(SessionsContext);
  if (value === undefined) {
    throw new Error(
      'useSessionsContext must be used inside a SessionsProvider'
    );
  }
  return value;
}

export default function SessionsProvider(props: { children?: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionDetails, setActiveSessionDetails] =
    useState<ActiveSessionDetails>({
      isHost: false,
      activeSession: null,
      socket: null,
    });

  // Non-null: SetPresenterPage mounts this under SecuredRoutes, which renders
  // only once the current user loads.
  const currentUser = useSelector(selectCurrentUser)!;
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
    (setlist: Setlist) => {
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
        initializedSocket.on('inactive session', () => {
          toast('Inactive session', {
            hideProgressBar: true,
            autoClose: 2000,
            pauseOnHover: false,
          });
          setActiveSessionDetails({
            activeSession: null,
            socket: null,
            isHost: false,
          });
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

  async function handleStartSession(
    setlist: Setlist,
    currentSongIndex: number
  ) {
    try {
      const toastId = toast.loading('Starting session');
      const { data: newSession } = await SessionsApi.startSession(setlist.id);
      const initializedSocket = joinSession(newSession, credentials);

      initializedSocket.emit('perform scroll', {
        scrollTop: window.scrollY,
        sessionId: newSession.id,
      });
      initializedSocket.emit('perform change song', {
        songIndex: currentSongIndex,
        sessionId: newSession.id,
      });

      initializedSocket.on('inactive session', () => {
        toast('Your session is now inactive', {
          hideProgressBar: true,
          autoClose: 2000,
          pauseOnHover: false,
        });
        activeSessionDetails?.socket?.disconnect();
        setActiveSessionDetails({
          activeSession: null,
          socket: null,
          isHost: false,
        });
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

  // Called only while hosting a session (SetlistAdjustmentsDrawer checks
  // activeSession && isHost), and starting one sets the socket too.
  async function handleEndSession() {
    const { activeSession, socket } = activeSessionDetails;
    try {
      const id = toast.loading('Ending session');
      await SessionsApi.endSession(
        activeSession!.setlist_id,
        activeSession!.id
      );
      toast.update(id, {
        render: 'Session ended!',
        isLoading: false,
        hideProgressBar: true,
        pauseOnHover: false,
        autoClose: 2000,
      });
      socket!.emit('end session', { sessionId: activeSession!.id });
      socket!.disconnect();
      setActiveSessionDetails({
        activeSession: null,
        socket: null,
        isHost: false,
      });
    } catch (error) {
      reportError(error);
    }
  }

  function handleSongChange(newIndex: number) {
    const { activeSession, socket, isHost } = activeSessionDetails;
    if (activeSession && socket && isHost) {
      socket.emit('perform change song', {
        songIndex: newIndex,
        sessionId: activeSession.id,
      });
    }
  }

  const handleJoinAsMember = useCallback(
    (session: Session) => {
      const initializedSocket = joinSession(session, credentials);

      toast.success('Connected to session', {
        hideProgressBar: true,
        autoClose: 2000,
        pauseOnHover: false,
      });

      initializedSocket.on('scroll to', scrollTop => {
        // Every document has an <html> element.
        const html = document.querySelector('html')!;
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

  // Called only from a joined session's Leave control, and joining sets the
  // socket.
  function handleLeaveAsMember() {
    const { socket } = activeSessionDetails;

    socket!.disconnect();
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
    (sessionId: string, sessions: Session[]) => {
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
