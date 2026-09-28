import MetronomeIcon from '../icons/MetronomeIcon';
import Icon from './Icon';
import ScrollIcon from '../icons/ScrollIcon';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import { useSelector } from 'react-redux';
import {
  SettingsAction,
  SettingsSection,
  SettingsSwitch,
} from './SettingsList';
import type { Song, SongFormat } from '../types';

type SongAdjustmentsDrawerMainSheetProps = {
  song: Song;
  onFormatChange: (field: keyof SongFormat, value: boolean) => void;
  onAddNote?: () => void;
  /** The drawer's default branch doesn't pass it; that branch never renders. */
  onShowBottomSheet?: (sheet: 'autoscroll' | 'metronome') => void;
  onSongChange: (field: keyof Song, value: boolean) => void;
  /** Not read. */
  onShowAutoScrollSheet?: () => void;
};

export default function SongAdjustmentsDrawerMainSheet({
  song,
  onFormatChange,
  onAddNote,
  onShowBottomSheet,
  onSongChange,
}: SongAdjustmentsDrawerMainSheetProps) {
  const currentSubscription = useSelector(selectCurrentSubscription);

  return (
    <>
      <SettingsSection title="Display">
        <SettingsSwitch
          label="Resize lyrics"
          enabled={song?.format?.autosize}
          onChange={enabled => onFormatChange('autosize', enabled)}
        />
        <SettingsSwitch
          label="Show chords"
          enabled={!song.format.chords_hidden}
          onChange={enabled => onFormatChange('chords_hidden', !enabled)}
        />
        <SettingsSwitch
          label="Show roadmap"
          enabled={song.show_roadmap}
          onChange={enabled => onSongChange('show_roadmap', enabled)}
        />
      </SettingsSection>

      <SettingsSection title="Tools">
        <SettingsAction
          icon={<ScrollIcon />}
          label="Auto scroll"
          // The drawer passes it wherever it renders this sheet (see the prop).
          onClick={() => onShowBottomSheet!('autoscroll')}
        />
        <SettingsAction
          icon={<MetronomeIcon />}
          label="Metronome"
          onClick={() => onShowBottomSheet!('metronome')}
        />
        {/* SecuredRoutes renders pages once the team is set, and the
            subscription is dispatched right after it, before this drawer can
            be opened by a user action. */}
        {currentSubscription!.isPro && (
          <SettingsAction
            icon={<Icon name="sticky_note_2" />}
            label="Add a note"
            onClick={onAddNote}
          />
        )}
      </SettingsSection>
    </>
  );
}
