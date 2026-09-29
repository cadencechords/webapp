import { EDIT_SONGS, START_SESSIONS } from '../utils/constants';
import { useSelector } from 'react-redux';

import Drawer from './Drawer';
import ScrollIcon from '../icons/ScrollIcon';
import { selectCurrentMember } from '../store/authSlice';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import SessionIcon from '../icons/SessionIcon';
import { useSessionsContext } from '../contexts/SessionsProvider';
import NumberBadge from './NumberBadge';
import Icon from './Icon';
import {
  SettingsAction,
  SettingsSection,
  SettingsSwitch,
} from './SettingsList';
import type { SetPresenterSheet } from './SetPresenterBottomSheet';
import type { Setlist, Song, SongFormat } from '../types';

type SetlistAdjustmentsDrawerProps = {
  song: Song;
  onSongUpdate: <K extends 'format' | 'show_roadmap'>(
    field: K,
    value: Song[K]
  ) => void;
  open: boolean;
  onClose: () => void;
  onShowBottomSheet: (sheet: SetPresenterSheet) => void;
  setlist: Setlist;
  currentSongIndex: number;
  onAddNote: () => void;
};

export default function SetlistAdjustmentsDrawer({
  song,
  onSongUpdate,
  open,
  onClose,
  onShowBottomSheet,
  setlist,
  currentSongIndex,
  onAddNote,
}: SetlistAdjustmentsDrawerProps) {
  // Non-null: kept as before, this throws if the membership hasn't loaded.
  const currentMember = useSelector(selectCurrentMember)!;
  // Non-null: kept as before. SecuredRoutes renders pages once the team is
  // set, and the subscription is dispatched right after it.
  const currentSubscription = useSelector(selectCurrentSubscription)!;
  const {
    sessions,
    onStartSession,
    onEndSession,
    onLeaveAsMember,
    activeSessionDetails: { isHost, activeSession },
  } = useSessionsContext();

  function handleFormatUpdate(field: keyof SongFormat, value: boolean) {
    const updatedFormat = { ...song.format, [field]: value };
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

  const hosting = Boolean(activeSession && isHost);

  return (
    <Drawer open={open} onClose={onClose} title="Song settings">
      <SettingsSection title="Display">
        <SettingsSwitch
          label="Resize lyrics"
          enabled={song?.format?.autosize}
          onChange={enabled => handleFormatUpdate('autosize', enabled)}
        />
        <SettingsSwitch
          label="Show chords"
          enabled={!song?.format?.chords_hidden}
          onChange={enabled => handleFormatUpdate('chords_hidden', !enabled)}
        />
        <SettingsSwitch
          label="Show roadmap"
          enabled={song?.show_roadmap}
          onChange={enabled => onSongUpdate('show_roadmap', enabled)}
        />
      </SettingsSection>

      <SettingsSection title="Tools">
        <SettingsAction
          icon={<ScrollIcon />}
          label="Auto scroll"
          onClick={() => onShowBottomSheet('autoscroll')}
        />
        {currentSubscription.isPro && (
          <SettingsAction
            icon={<Icon name="sticky_note_2" />}
            label="Add a note"
            onClick={onAddNote}
          />
        )}
        {currentMember.can(EDIT_SONGS) && (
          <SettingsAction
            icon={<Icon name="edit" />}
            label="Edit song"
            to={{ pathname: `/songs/${song?.id}/edit`, state: song }}
          />
        )}
      </SettingsSection>

      {currentSubscription.isPro && (
        <SettingsSection title="Session">
          {currentMember.can(START_SESSIONS) && (
            <SettingsAction
              icon={<SessionIcon />}
              label={hosting ? 'End session' : 'Start session'}
              onClick={handleToggleSessionAndCloseDrawer}
            />
          )}
          <SettingsAction
            icon={<Icon name="group" filled />}
            label="View sessions"
            // You can't join another session while hosting one.
            disabled={hosting}
            onClick={() => onShowBottomSheet('sessions')}
            trailing={
              <NumberBadge className="px-1.5 h-5 min-w-5" disabled={hosting}>
                {sessions.length}
              </NumberBadge>
            }
          />
          {activeSession && !isHost && (
            <SettingsAction
              icon={<Icon name="logout" />}
              label="Leave session"
              destructive
              onClick={handleLeaveSessionAndCloseDrawer}
            />
          )}
        </SettingsSection>
      )}
    </Drawer>
  );
}
