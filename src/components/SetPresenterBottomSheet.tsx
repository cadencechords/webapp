import AutoscrollSheet from './AutoscrollSheet';
import BottomSheet from './BottomSheet';
import SessionsSheet from './SessionsSheet';
import type { Song } from '../types';

/** The bottom sheets the set presenter shows. */
export type SetPresenterSheet = 'autoscroll' | 'sessions';

type SetPresenterBottomSheetProps = {
  /** Undefined until the setlist's songs load. */
  song: Song | undefined;
  /** '' until one is picked; then both sheets are hidden. */
  sheet: SetPresenterSheet | '';
  open: boolean;
  onClose: () => void;
  onSongUpdate: (field: 'scroll_speed', value: number) => void;
};

export default function SetPresenterBottomSheet({
  song,
  sheet,
  open,
  onClose,
  onSongUpdate,
}: SetPresenterBottomSheetProps) {
  function isHidden(sheetInQuestion: SetPresenterSheet) {
    return sheet === sheetInQuestion ? '' : 'hidden';
  }

  return (
    <BottomSheet open={open} onClose={onClose} className="p-2">
      {song && (
        <>
          <AutoscrollSheet
            song={song}
            onSongChange={onSongUpdate}
            className={isHidden('autoscroll')}
            bottomSheetOpen={open}
            shortcutClasses="bottom-16 right-4"
          />
          <SessionsSheet className={isHidden('sessions')} onClose={onClose} />
        </>
      )}
    </BottomSheet>
  );
}
