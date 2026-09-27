import classNames from 'classnames';
import { useRef, type CSSProperties } from 'react';
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

  // The invisible input takes the clicks, as it always has: a click inside
  // a <label> reaches it, and a clickable row gets one click. It stays first
  // in the DOM (a label forwards to its first labelable element, and the
  // button is one) and paints on top with z-[1], kept inside the checkbox by
  // `isolate`. The button is reached by keyboard. The 40px state layer is a
  // box-shadow, so it doesn't widen the click area.
  const stateLayer = (opacity: number) =>
    `0 0 0 10px color-mix(in srgb, currentColor ${opacity}%, transparent), inset 0 0 0 10px color-mix(in srgb, currentColor ${opacity}%, transparent)`;

  return (
    <span
      className={classNames(
        'group relative isolate inline-flex shrink-0',
        className
      )}
      style={
        {
          '--checkbox-hover': stateLayer(8),
          '--checkbox-press': stateLayer(10),
        } as CSSProperties
      }
    >
      <input
        ref={ref}
        type="checkbox"
        className="absolute inset-0 z-[1] w-5 h-5 m-0 opacity-0 cursor-pointer"
        readOnly
        checked={checked}
        onChange={() => onChange(!checked)}
        id={id}
      />
      {/* M3 checkbox: an 18px box in the 20px button */}
      <button
        className={classNames(
          'w-5 h-5 shrink-0 flex-center rounded-full cursor-pointer outline-hidden focus-ring transition-fast-effects',
          'group-hover:shadow-(--checkbox-hover) focus-visible:shadow-(--checkbox-press) group-has-[input:focus-visible]:shadow-(--checkbox-press) group-active:shadow-(--checkbox-press)',
          checked ? CHECKED_COLORS[color] : 'text-on-surface-variant'
        )}
        onClick={standAlone ? handleClick : undefined}
      >
        <span
          className={classNames(
            'w-[18px] h-[18px] flex-center rounded-[2px] transition-fast-effects',
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
    </span>
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
