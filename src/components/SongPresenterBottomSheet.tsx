import AutoscrollSheet from './AutoscrollSheet';
import BottomSheet from './BottomSheet';
import MetronomeSheet from './MetronomeSheet';
import type { Song } from '../types';

/** The bottom sheets the song presenter shows. */
export type SongPresenterSheet = 'autoscroll' | 'metronome';

type SongPresenterBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  /** Unset until one is picked; then both sheets are hidden. */
  sheet: SongPresenterSheet | undefined;
  song: Song;
  onSongChange: <K extends 'bpm' | 'scroll_speed'>(
    field: K,
    value: Song[K]
  ) => void;
};

export default function SongPresenterBottomSheet({
  open,
  onClose,
  sheet,
  song,
  onSongChange,
}: SongPresenterBottomSheetProps) {
  function isHidden(sheetInQuestion: SongPresenterSheet) {
    return sheet === sheetInQuestion ? '' : 'hidden';
  }

  return (
    <BottomSheet open={open} onClose={onClose} className="px-3 py-2">
      <MetronomeSheet
        song={song}
        onSongChange={onSongChange}
        className={isHidden('metronome')}
      />
      <AutoscrollSheet
        song={song}
        onSongChange={onSongChange}
        className={isHidden('autoscroll')}
        bottomSheetOpen={open}
        shortcutClasses="bottom-4 right-4"
      />
    </BottomSheet>
  );
}
