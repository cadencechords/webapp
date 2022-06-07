import io from 'socket.io-client';

const SESSIONS_URL = process.env.REACT_APP_SESSIONS_URL;

export function findSessionCurrentUserIsHosting(user, sessions) {
  return sessions?.find(s => s.user_id === user.id);
}

export function joinSession(session, credentials) {
  let s = io(SESSIONS_URL);

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
