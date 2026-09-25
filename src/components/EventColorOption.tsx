import { BACKGROUND_COLORS, type ButtonColor } from './Button';

type EventColorOptionProps = {
  disabled?: boolean;
  onClick?: (color: ButtonColor) => void;
  color: ButtonColor;
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
      className={`focus:outline-hidden outline-hidden h-5 w-5 rounded-full transition-colors ${BACKGROUND_COLORS[color]} ${className}`}
      disabled={disabled}
      onClick={() => onClick?.(color)}
    ></button>
  );
}
