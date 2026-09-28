import classNames from 'classnames';
import Icon from './Icon';
import { noteColorClasses } from './Note';

type NoteColorOptionProps = {
  /** A note color: blue, pink, green or yellow. */
  color: string;
  selected: boolean;
  /** Called with `color`. */
  onClick: (color: string) => void;
};

// A note color as a 40dp round swatch in a radio group, like an event's or a
// folder's: the picked one shows a check and a ring 2px outside it.
export default function NoteColorOption({
  color,
  selected,
  onClick,
}: NoteColorOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={color}
      onClick={() => onClick(color)}
      className={classNames(
        'flex-center w-10 h-10 rounded-full focus-ring transition-fast-effects',
        noteColorClasses(color).side,
        selected
          ? 'outline-2 outline-offset-2 outline-solid outline-on-surface'
          : 'hover:scale-110'
      )}
    >
      {selected && <Icon name="check" className="w-5 h-5" />}
    </button>
  );
}
