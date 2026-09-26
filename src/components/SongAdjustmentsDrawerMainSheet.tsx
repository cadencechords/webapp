import AddStickyNoteIcon from '../icons/AddStickyNoteIcon';
import MetronomeIcon from '../icons/MetronomeIcon';
import MobileMenuButton from './buttons/MobileMenuButton';
import ScrollIcon from '../icons/ScrollIcon';
import Toggle from './Toggle';
import { noop } from '../utils/constants';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import { useSelector } from 'react-redux';
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
  const iconClasses = 'w-5 h-5 mr-3 text-blue-600 dark:text-dark-blue';

  return (
    <div className="flex flex-col pt-5">
      <MobileMenuButton
        onClick={() => onFormatChange('autosize', !song?.format?.autosize)}
        className="flex-between"
      >
        Resize lyrics{' '}
        <Toggle enabled={song?.format?.autosize} onChange={noop} />
      </MobileMenuButton>
      <MobileMenuButton
        className="flex-between"
        onClick={() =>
          onFormatChange('chords_hidden', !song.format.chords_hidden)
        }
      >
        Show chords
        <Toggle
          enabled={!song.format.chords_hidden}
          onChange={noop}
          spacing="between"
        />
      </MobileMenuButton>
      <MobileMenuButton
        className="flex-between"
        onClick={() => onSongChange('show_roadmap', !song.show_roadmap)}
      >
        Show roadmap
        <Toggle enabled={song.show_roadmap} onChange={noop} spacing="between" />
      </MobileMenuButton>

      {currentSubscription.isPro && (
        <MobileMenuButton
          className="hidden sm:flex sm:items-center"
          onClick={onAddNote}
        >
          <AddStickyNoteIcon className={iconClasses} />
          Add a note
        </MobileMenuButton>
      )}
      <MobileMenuButton
        className="flex items-center"
        onClick={() => onShowBottomSheet('autoscroll')}
        full
      >
        <ScrollIcon className={iconClasses} /> Auto scroll
      </MobileMenuButton>
      <MobileMenuButton
        className="flex items-center"
        onClick={() => onShowBottomSheet('metronome')}
      >
        <MetronomeIcon className={iconClasses} /> Metronome
      </MobileMenuButton>
    </div>
  );
}
