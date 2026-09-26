import { useSessionsContext } from '../contexts/SessionsProvider';
import NoDataMessage from './NoDataMessage';
import SectionTitle from './SectionTitle';
import SessionCard from './SessionCard';
import type { Session } from '../types';

type SessionsSheetProps = {
  className: string;
  onClose: () => void;
};

// Kept as before: this passes SessionCard no onSessionEnded, so ending your
// own session from here reports an error (see SessionCard).
export default function SessionsSheet({
  className,
  onClose,
}: SessionsSheetProps) {
  const {
    sessions,
    onJoinAsMember,
    onLeaveAsMember,
    activeSessionDetails: { activeSession },
  } = useSessionsContext();

  function handleJoin(session: Session) {
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
