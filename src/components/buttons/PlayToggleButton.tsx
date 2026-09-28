import Icon from '../Icon';

type PlayToggleButtonProps = {
  playing: boolean;
  onClick: () => void;
  /** Accessible name, which changes with `playing`. */
  label: string;
  /** Icon shown while playing: pause, or stop when that's what it does. */
  playingIcon?: 'pause' | 'stop';
  size?: 'medium' | 'large';
};

// M3E filled toggle icon button, round while stopped and squaring off while
// playing (aria-pressed, through shape-morph). Medium is 56px, large 96px;
// the icons are drawn larger than the spec's because the filled play and
// pause glyphs sit well inside their 24px grid.
const SIZES = {
  medium:
    'w-14 h-14 rounded-[28px] [--shape-morph-to:16px] [&>svg]:w-8 [&>svg]:h-8',
  large:
    'w-24 h-24 rounded-[48px] [--shape-morph-to:28px] [&>svg]:w-14 [&>svg]:h-14',
};

export default function PlayToggleButton({
  playing,
  onClick,
  label,
  playingIcon = 'pause',
  size = 'large',
}: PlayToggleButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={playing}
      className={`flex-center bg-primary text-on-primary state-layer-flat focus-ring shape-morph ${SIZES[size]}`}
      onClick={onClick}
    >
      <Icon name={playing ? playingIcon : 'play_arrow'} filled />
    </button>
  );
}
