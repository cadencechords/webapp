import { useSessionsContext } from '../contexts/SessionsProvider';
import NoDataMessage from './NoDataMessage';
import SheetHeader from './SheetHeader';
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
      <SheetHeader title="Sessions" />
      <p className="-mt-4 mb-4 font-plain text-body-medium text-on-surface-variant">
        Join a session to follow its host through the set, song by song.
      </p>
      {sessions?.length > 0 ? (
        <div className="list-segmented">
          {sessions.map(session => {
            const isActive = activeSession?.id === session.id;
            return (
              <SessionCard
                session={session}
                key={session.id}
                onJoin={handleJoin}
                isActive={isActive}
                onLeave={handleLeave}
                // The session you follow, on secondary-container.
                className={
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container'
                    : undefined
                }
              />
            );
          })}
        </div>
      ) : (
        <NoDataMessage
          compact
          description="When someone starts one for this set, it shows here."
        >
          No sessions to join
        </NoDataMessage>
      )}
    </div>
  );
}
