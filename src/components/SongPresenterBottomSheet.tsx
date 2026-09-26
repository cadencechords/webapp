import AutoscrollSheet from './AutoscrollSheet';
import BottomSheet from './BottomSheet';
import MetronomeSheet from './MetronomeSheet';

export default function SongPresenterBottomSheet({
  open,
  onClose,
  sheet,
  song,
  onSongChange,
}) {
  function isHidden(sheetInQuestion) {
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
