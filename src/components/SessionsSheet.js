import React, { useContext } from 'react';
import { SessionsContext } from '../contexts/SessionsProvider';
import NoDataMessage from './NoDataMessage';
import SectionTitle from './SectionTitle';
import SessionCard from './SessionCard';

export default function SessionsSheet({ className, onClose }) {
  const {
    sessions,
    onJoinAsMember,
    onLeaveAsMember,
    activeSessionDetails: { activeSession },
  } = useContext(SessionsContext);

  function handleJoin(session) {
    onJoinAsMember(session);
    onClose();
  }

  function handleLeave() {
    onLeaveAsMember();
    onClose();
  }

  return (
    <div className={` ${className}`}>
      <SectionTitle title="Sessions" />
      {sessions?.length > 0 ? (
        sessions?.map(session => (
          <SessionCard
            className="mb-4"
            session={session}
            key={session.id}
            onJoin={handleJoin}
            isActive={activeSession?.id === session.id}
            onLeave={handleLeave}
          />
        ))
      ) : (
        <NoDataMessage>No available sessions to join</NoDataMessage>
      )}
    </div>
  );
}
