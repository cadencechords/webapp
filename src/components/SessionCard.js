import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SessionsApi from '../api/sessionsApi';
import { selectCurrentUser } from '../store/authSlice';
import { reportError } from '../utils/error';
import { hasName } from '../utils/model';
import Button from './Button';
import Card from './Card';
import ProfilePicture from './ProfilePicture';

export default function SessionCard({
  isActive,
  session,
  onSessionEnded,
  onJoin,
  onLeave,
  className,
}) {
  const currentUser = useSelector(selectCurrentUser);
  const isUserSessionHost = session.user.id === currentUser.id;
  const [ending, setEnding] = useState(false);

  async function handleEndSession() {
    try {
      setEnding(true);
      await SessionsApi.endSession(session.setlist_id, session.id);
      onSessionEnded(session);
    } catch (error) {
      reportError(error);
      setEnding(false);
    }
  }

  function renderButton() {
    if (isUserSessionHost) {
      return (
        <Button
          variant="accent"
          color="red"
          size="xs"
          loading={ending}
          onClick={handleEndSession}
          full={true}
        >
          End session
        </Button>
      );
    } else if (isActive) {
      return (
        <Button
          variant="accent"
          color="red"
          size="xs"
          loading={ending}
          onClick={() => onLeave(session)}
          full={true}
        >
          Leave session
        </Button>
      );
    } else {
      return (
        <Button
          variant="accent"
          size="xs"
          full={true}
          onClick={() => onJoin(session)}
        >
          Join session
        </Button>
      );
    }
  }

  return (
    <Card className={`dark:bg-dark-gray-800 ${className}`}>
      <div className="flex mb-8">
        <div className="pt-1">
          <ProfilePicture url={session.user?.image_url} size="xs" />
        </div>
        <div className="ml-4 text-left">
          <div className="font-semibold">
            {hasName(session.user)
              ? `${session.user.first_name} ${session.user.last_name}`
              : session.user.email}
          </div>
          <div className="text-sm text-gray-600 dark:text-dark-gray-200">
            Host
          </div>
        </div>
      </div>

      {renderButton()}
    </Card>
  );
}
