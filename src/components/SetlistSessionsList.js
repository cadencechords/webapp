import React, { useEffect, useState } from 'react';
import SessionsApi from '../api/sessionsApi';
import { reportError } from '../utils/error';
import NoDataMessage from './NoDataMessage';
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
    <div style={{ minHeight: '150px' }} className="mt-12">
      <div className="pt-3 mb-3 text-lg font-semibold border-t flex-between dark:border-dark-gray-600">
        Sessions
      </div>
      {sessions.length === 0 ? (
        <NoDataMessage loading={loading}>
          No active sessions to show
        </NoDataMessage>
      ) : (
        <div className="flex gap-4 my-4 overflow-x-auto flex-nowrap">
          {sessions.map(session => (
            <div key={session.id} className="flex-shrink-0 w-72">
              <SessionCard
                session={session}
                onSessionEnded={handleSessionEnded}
                onJoin={onJoinSession}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
