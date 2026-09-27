import classNames from 'classnames';
import { useRef } from 'react';
import Icon from './Icon';

type CheckboxProps = {
  color?: keyof typeof CHECKED_COLORS;
  checked?: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  id?: string;
  standAlone?: boolean;
};

export default function Checkbox({
  color = 'blue',
  checked,
  onChange,
  className = '',
  id,
  standAlone = true,
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  function handleClick() {
    ref.current?.click();
  }

  return (
    <>
      <input
        ref={ref}
        type="checkbox"
        className="absolute w-5 h-5 opacity-0"
        readOnly
        checked={checked}
        onChange={() => onChange(!checked)}
        id={id}
      />
      {/* M3 checkbox: an 18px box in the 20px button, with a 40px state
          layer circle drawn outside it. */}
      <button
        className={classNames(
          'relative w-5 h-5 shrink-0 flex-center rounded-[2px] cursor-pointer outline-hidden focus-ring',
          "before:content-[''] before:absolute before:-inset-2.5 before:rounded-full before:bg-current before:opacity-0 before:transition-opacity",
          'hover:before:opacity-[0.08] focus-visible:before:opacity-[0.1] active:before:opacity-[0.1]',
          checked ? CHECKED_COLORS[color] : 'text-on-surface-variant',
          className
        )}
        onClick={standAlone ? handleClick : undefined}
      >
        <span
          className={classNames(
            'relative w-[18px] h-[18px] flex-center rounded-[2px] transition-fast-effects',
            checked ? 'bg-current' : 'border-2 border-current'
          )}
        >
          <Icon
            name="check"
            filled
            className={classNames(
              'w-4 h-4 transition-fast-spatial',
              CHECK_COLORS[color],
              checked ? 'scale-100' : 'scale-0'
            )}
          />
        </span>
      </button>
    </>
  );
}

// The box fills with the color (text color, via currentColor) and the check
// takes the matching on-color. Blue is primary; the rest are user colors.
const CHECKED_COLORS = {
  blue: 'text-primary',
  red: 'text-user-red',
  yellow: 'text-user-yellow',
  green: 'text-user-green',
  purple: 'text-user-purple',
  indigo: 'text-user-indigo',
  pink: 'text-user-pink',
  gray: 'text-user-gray',
  black: 'text-user-black',
  white: 'text-surface-container-lowest',
};

const CHECK_COLORS: Record<keyof typeof CHECKED_COLORS, string> = {
  blue: 'text-on-primary',
  red: 'text-on-user-red',
  yellow: 'text-on-user-yellow',
  green: 'text-on-user-green',
  purple: 'text-on-user-purple',
  indigo: 'text-on-user-indigo',
  pink: 'text-on-user-pink',
  gray: 'text-on-user-gray',
  black: 'text-on-user-black',
  white: 'text-on-surface',
};
