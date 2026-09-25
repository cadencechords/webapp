import MobileMenuButton from './buttons/MobileMenuButton';
import Range from './Range';
import Icon from './Icon';

export default function SongAdjustmentsDrawerAutoscrollSheet({
  onShowMainSheet,
  song,
  onSongChange,
  autoScrolling,
  onToggleAutoScrolling,
}) {
  const iconClasses = 'w-5 h-5 mr-3 text-blue-600';
  return (
    <div>
      <MobileMenuButton
        full
        className="text-left flex items-center"
        onClick={onShowMainSheet}
      >
        <Icon name="arrow_back" className="w-5 h-5 mr-3" /> Back
      </MobileMenuButton>
      <h1 className="px-6 font-medium py-3">Auto scroll</h1>
      <MobileMenuButton
        full
        className="flex items-center text-left"
        onClick={onToggleAutoScrolling}
      >
        {autoScrolling ? (
          <>
            <Icon name="stop_circle" filled className={iconClasses} />
            Stop
          </>
        ) : (
          <>
            <Icon name="play_circle" filled className={iconClasses} />
            Start
          </>
        )}
      </MobileMenuButton>
      <div className="mt-32">
        <Range
          step={1}
          max={10}
          min={1}
          value={song.scroll_speed || 1}
          onChange={e => onSongChange('scroll_speed', e)}
        />
      </div>
    </div>
  );
}
