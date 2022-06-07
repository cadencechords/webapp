import { EDIT_SONGS, noop, START_SESSIONS } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';

import Drawer from './Drawer';
import MobileMenuButton from './buttons/MobileMenuButton';
import PencilIcon from '@heroicons/react/solid/PencilIcon';
import ScrollIcon from '../icons/ScrollIcon';
import Toggle from './Toggle';
import { selectCurrentMember } from '../store/authSlice';
import { setSongBeingEdited } from '../store/editorSlice';
import { useHistory } from 'react-router-dom';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import SessionIcon from '../icons/SessionIcon';
import { useContext } from 'react';
import { SessionsContext } from '../contexts/SessionsProvider';
import NumberBadge from './NumberBadge';

export default function SetlistAdjustmentsDrawer({
  song,
  onSongUpdate,
  open,
  onClose,
  onShowBottomSheet,
  setlist,
  currentSongIndex,
}) {
  const currentMember = useSelector(selectCurrentMember);
  const currentSubscription = useSelector(selectCurrentSubscription);
  const dispatch = useDispatch();
  const router = useHistory();
  const iconClasses = 'w-5 h-5 mr-3 text-blue-600 dark:text-dark-blue';
  const {
    sessions,
    onStartSession,
    onEndSession,
    onLeaveAsMember,
    activeSessionDetails: { isHost, activeSession },
  } = useContext(SessionsContext);

  function handleOpenInEditor() {
    dispatch(setSongBeingEdited(song));
    router.push('/editor');
  }

  function handleFormatUpdate(field, value) {
    let updatedFormat = { ...song.format, [field]: value };
    onSongUpdate('format', updatedFormat);
  }

  function handleToggleSessionAndCloseDrawer() {
    onClose();

    if (activeSession && isHost) {
      onEndSession();
    } else {
      onStartSession(setlist, currentSongIndex);
    }
  }

  function handleLeaveSessionAndCloseDrawer() {
    onLeaveAsMember();
    onClose();
  }

  return (
    <Drawer open={open} onClose={onClose}>
      <div className="pt-8">
        <MobileMenuButton
          full
          className="flex-between"
          onClick={() =>
            handleFormatUpdate('autosize', !song?.format?.autosize)
          }
        >
          Resize lyrics
          <Toggle enabled={song?.format?.autosize} onChange={noop} />
        </MobileMenuButton>
        <MobileMenuButton
          full
          className="flex-between"
          onClick={() =>
            handleFormatUpdate('chords_hidden', !song?.format?.chords_hidden)
          }
        >
          Show chords
          <Toggle
            enabled={!song?.format?.chords_hidden}
            onChange={noop}
            spacing="between"
          />
        </MobileMenuButton>
        <MobileMenuButton
          full
          className="flex-between"
          onClick={() => onSongUpdate('show_roadmap', !song?.show_roadmap)}
        >
          Show roadmap
          <Toggle
            enabled={song?.show_roadmap}
            onChange={noop}
            spacing="between"
          />
        </MobileMenuButton>

        {currentMember.can(EDIT_SONGS) && (
          <>
            <MobileMenuButton
              full
              className="flex items-center"
              onClick={handleOpenInEditor}
            >
              <PencilIcon className={iconClasses} />
              Edit
            </MobileMenuButton>
          </>
        )}
        <MobileMenuButton
          className="flex items-center"
          onClick={() => onShowBottomSheet('autoscroll')}
          full
        >
          <ScrollIcon className={iconClasses} /> Auto scroll
        </MobileMenuButton>

        {currentSubscription.isPro && currentMember.can(START_SESSIONS) && (
          <MobileMenuButton
            full
            className="flex items-center"
            onClick={handleToggleSessionAndCloseDrawer}
          >
            <SessionIcon className={iconClasses} />
            {activeSession && isHost ? 'End session' : 'Start session'}
          </MobileMenuButton>
        )}

        {currentSubscription.isPro && (
          <MobileMenuButton
            full
            className="flex items-center"
            disabled={activeSession && isHost}
            onClick={() => onShowBottomSheet('sessions')}
          >
            <NumberBadge className="mr-2" disabled={activeSession && isHost}>
              {sessions.length}
            </NumberBadge>
            <div>View sessions</div>
          </MobileMenuButton>
        )}

        {currentSubscription.isPro && activeSession && !isHost && (
          <MobileMenuButton
            full
            className="flex items-center"
            color="red"
            onClick={handleLeaveSessionAndCloseDrawer}
          >
            Leave session
          </MobileMenuButton>
        )}
      </div>
    </Drawer>
  );
}
