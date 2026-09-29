import classNames from 'classnames';
import Icon from './Icon';
import { userColorClasses } from '../utils/userColors';
import type { ButtonColor } from './Button';

const EVENT_COLORS: ButtonColor[] = [
  'red',
  'blue',
  'yellow',
  'green',
  'pink',
  'purple',
  'indigo',
  'gray',
  'black',
];

type EventColorOptionsProps = {
  selectedColor?: ButtonColor;
  onClick: (color: ButtonColor) => void;
};

// An event's color as a row of 40dp round swatches that wraps, as a radio
// group, like a folder's (ColorSwatches). The picked one shows a check and a
// ring 2px outside it.
export default function EventColorOptions({
  selectedColor,
  onClick,
}: EventColorOptionsProps) {
  return (
    <div role="radiogroup" aria-label="Color" className="flex flex-wrap gap-3">
      {EVENT_COLORS.map(color => {
        const isPicked = color === selectedColor;
        const { color: background, onColor } = userColorClasses(color);
        return (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={isPicked}
            aria-label={color}
            onClick={() => onClick(color)}
            className={classNames(
              'flex-center w-10 h-10 rounded-full focus-ring transition-fast-effects',
              background,
              onColor,
              isPicked
                ? 'outline-2 outline-offset-2 outline-solid outline-on-surface'
                : 'hover:scale-110'
            )}
          >
            {isPicked && <Icon name="check" className="w-5 h-5" />}
          </button>
        );
      })}
    </div>
  );
}
