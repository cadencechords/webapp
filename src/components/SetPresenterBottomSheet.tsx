import AutoscrollSheet from './AutoscrollSheet';
import BottomSheet from './BottomSheet';
import SessionsSheet from './SessionsSheet';

export default function SetPresenterBottomSheet({
  song,
  sheet,
  open,
  onClose,
  onSongUpdate,
}) {
  function isHidden(sheetInQuestion) {
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
