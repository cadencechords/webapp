import { BACKGROUND_COLORS, type ButtonColor } from './Button';

type EventColorOptionProps = {
  disabled?: boolean;
  onClick?: (color: ButtonColor | undefined) => void;
  /** EventDetailDialog passes the event's color, which may be missing. */
  color?: ButtonColor;
  className?: string;
};

export default function EventColorOption({
  disabled,
  onClick,
  color,
  className = '',
}: EventColorOptionProps) {
  return (
    <button
      // Without a color (undefined, null or "") this gets the class "undefined",
      // as before.
      className={`focus:outline-hidden outline-hidden h-5 w-5 rounded-full transition-colors ${color ? BACKGROUND_COLORS[color] : undefined} ${className}`}
      disabled={disabled}
      onClick={() => onClick?.(color)}
    ></button>
  );
}
