import React, { useEffect, useState } from 'react';
import SessionsApi from '../api/sessionsApi';
import { reportError } from '../utils/error';
import NoDataMessage from './NoDataMessage';
import SectionTitle from './SectionTitle';
import SessionCard from './SessionCard';

export default function SetlistSessionsList({
  setlist,
  onSessionsChange,
  sessions,
  onJoinSession,
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let { data } = await SessionsApi.getActiveSessions(setlist.id);
        onSessionsChange(data);
      } catch (error) {
        reportError(error);
      } finally {
        setLoading(false);
      }
    }

    if (setlist?.id) {
      fetchData();
    }
  }, [setlist.id, onSessionsChange]);

  function handleSessionEnded(endedSession) {
    let updatedSessions = sessions.filter(s => s.id !== endedSession.id);
    onSessionsChange(updatedSessions);
  }

  return (
    <div style={{ minHeight: '150px' }} className="mt-8 md:mt-0">
      <SectionTitle title="Sessions" underline />
      {sessions.length === 0 ? (
        <NoDataMessage loading={loading}>
          No active sessions to show
        </NoDataMessage>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
          {sessions.map(session => (
            <SessionCard
              session={session}
              key={session.id}
              onSessionEnded={handleSessionEnded}
              onJoin={onJoinSession}
            />
          ))}
        </div>
      )}
    </div>
  );
}
