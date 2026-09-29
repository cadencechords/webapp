import { useState } from 'react';
import { useSelector } from 'react-redux';
import SessionsApi from '../api/sessionsApi';
import { selectCurrentUser } from '../store/authSlice';
import { reportError } from '../utils/error';
import { hasName } from '../utils/model';
import Button from './Button';
import classNames from 'classnames';
import { LIST_ITEM_TWO_LINE, LIST_SUPPORTING_TEXT } from './lists/listItem';
import ProfilePicture from './ProfilePicture';
import type { Session } from '../types';
import { getNameOrEmail } from '../utils/model';

type SessionCardProps = {
  isActive?: boolean;
  session: Session;
  /**
   * Called after the host ends the session. SessionsSheet doesn't pass it, so
   * there the call throws and handleEndSession reports that error.
   */
  onSessionEnded?: (session: Session) => void;
  onJoin: (session: Session) => void;
  /** Only called when isActive. */
  onLeave?: (session: Session) => void;
  /** Makes the whole row tappable, apart from its button. */
  onClick?: () => void;
  /** The row's accessible name when it has onClick. */
  clickLabel?: string;
  className?: string;
};

export default function SessionCard({
  isActive,
  session,
  onSessionEnded,
  onJoin,
  onLeave,
  onClick,
  clickLabel,
  className,
}: SessionCardProps) {
  // Non-null: rendered under SecuredRoutes, which renders only once the
  // current user loads.
  const currentUser = useSelector(selectCurrentUser)!;
  const isUserSessionHost = session.user.id === currentUser.id;
  const [ending, setEnding] = useState(false);

  async function handleEndSession() {
    try {
      setEnding(true);
      await SessionsApi.endSession(session.setlist_id, session.id);
      // Kept as before: when it's missing (SessionsSheet), this throws and the
      // catch below reports it. See the prop.
      onSessionEnded!(session);
    } catch (error) {
      reportError(error);
      setEnding(false);
    }
  }

  function renderButton() {
    // M3E small buttons: tonal error to end or leave, filled to join.
    if (isUserSessionHost) {
      return (
        <Button
          variant="accent"
          color="red"
          size="sm"
          loading={ending}
          onClick={handleEndSession}
        >
          End session
        </Button>
      );
    } else if (isActive) {
      return (
        <Button
          variant="accent"
          color="red"
          size="sm"
          loading={ending}
          // Passed wherever isActive is (SessionsSheet).
          onClick={() => onLeave!(session)}
        >
          Leave session
        </Button>
      );
    } else {
      return (
        <Button variant="filled" size="sm" onClick={() => onJoin(session)}>
          Join session
        </Button>
      );
    }
  }

  // An M3E two-line list item, for a list-segmented container: the host's
  // avatar and name, and the action at the end. With onClick, a button
  // stretched over the row takes the tap, under the action button.
  return (
    <div
      className={classNames(
        LIST_ITEM_TWO_LINE,
        onClick && 'relative state-layer-flat list-item-motion',
        className
      )}
    >
      <ProfilePicture
        // The session's host can come without their picture: when it's you,
        // use your own.
        url={
          (isUserSessionHost && currentUser.image_url) ||
          session.user?.image_url
        }
        name={session.user && getNameOrEmail(session.user)}
        size="md"
      />
      <div className="flex-1 min-w-0">
        <div className="truncate">
          {hasName(session.user)
            ? `${session.user.first_name} ${session.user.last_name}`
            : session.user.email}
        </div>
        <div className={LIST_SUPPORTING_TEXT}>
          {isUserSessionHost
            ? 'Host · You'
            : isActive
              ? 'Host · Following'
              : 'Host'}
        </div>
      </div>
      {onClick && (
        <button
          type="button"
          aria-label={clickLabel}
          onClick={onClick}
          className="absolute inset-0 rounded-[inherit] outline-none focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-secondary focus-visible:-outline-offset-3"
        />
      )}
      <div className="relative shrink-0">{renderButton()}</div>
    </div>
  );
}
