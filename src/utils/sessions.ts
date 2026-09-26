import io from 'socket.io-client';
import type { selectCredentials } from '../store/authSlice';
import type { Session, User } from '../types';

const SESSIONS_URL = import.meta.env.REACT_APP_SESSIONS_URL;

export function findSessionCurrentUserIsHosting(
  user: User,
  sessions: Session[] | undefined
) {
  return sessions?.find(s => s.user_id === user.id);
}

/** The signed-in credentials; the sessions server checks them. */
type SessionCredentials = ReturnType<typeof selectCredentials>;

export function joinSession(session: Session, credentials: SessionCredentials) {
  const s = io(SESSIONS_URL);

  s.emit('join session', {
    sessionId: session.id,
    auth: {
      token: credentials.accessToken,
      client: credentials.client,
      uid: credentials.uid,
    },
  });

  return s;
}
