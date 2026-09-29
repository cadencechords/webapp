import { useEffect, useState } from 'react';
import SessionsApi from '../api/sessionsApi';
import { reportError } from '../utils/error';
import NoDataMessage from './NoDataMessage';
import SectionTitle from './SectionTitle';
import SessionCard from './SessionCard';
import type { Session, Setlist } from '../types';

type SetlistSessionsListProps = {
  setlist: Setlist;
  onSessionsChange: (sessions: Session[]) => void;
  sessions: Session[];
  onJoinSession: (session: Session) => void;
  /** Tapping a session's row opens the set in the presenter. */
  onOpenInPresenter?: () => void;
};

export default function SetlistSessionsList({
  setlist,
  onSessionsChange,
  sessions,
  onJoinSession,
  onOpenInPresenter,
}: SetlistSessionsListProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data } = await SessionsApi.getActiveSessions(setlist.id);
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

  function handleSessionEnded(endedSession: Session) {
    const updatedSessions = sessions.filter(s => s.id !== endedSession.id);
    onSessionsChange(updatedSessions);
  }

  return (
    <section className="mt-12">
      <SectionTitle title="Sessions" />
      {sessions.length === 0 ? (
        <NoDataMessage compact loading={loading}>
          No active sessions to show
        </NoDataMessage>
      ) : (
        <div className="list-segmented">
          {sessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              onSessionEnded={handleSessionEnded}
              onJoin={onJoinSession}
              onClick={onOpenInPresenter}
              clickLabel="Perform set"
            />
          ))}
        </div>
      )}
    </section>
  );
}
