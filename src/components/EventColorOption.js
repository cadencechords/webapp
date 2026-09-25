import { BACKGROUND_COLORS } from './Button';

export default function EventColorOption({
  disabled,
  onClick,
  color,
  className,
}) {
  return (
    <button
      className={`focus:outline-hidden outline-hidden h-5 w-5 rounded-full transition-colors ${BACKGROUND_COLORS[color]} ${className}`}
      disabled={disabled}
      onClick={() => onClick?.(color)}
    ></button>
  );
}

EventColorOption.defaultProps = {
  className: '',
};
