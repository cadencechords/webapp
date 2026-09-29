import classNames from 'classnames';
import { useState, type CSSProperties, type ReactNode } from 'react';
import Icon from '../Icon';

type OutlinedSelectProps = {
  label: string;
  options: { value: string | number; display: ReactNode }[];
  selected?: string | number;
  onChange: (value: string) => void;
  id?: string;
  /** Classes for the field (margins, width). */
  className?: string;
  /** For the select itself, e.g. a font previewed in its own face. */
  style?: CSSProperties;
};

let nextId = 0;

// An M3 outlined dropdown field, like OutlinedInput: the label always sits
// in the outline's notch (a select always has a value), with the arrow at
// the end. The options menu is the browser's.
export default function OutlinedSelect({
  label,
  options,
  selected,
  onChange,
  id,
  className,
  style,
}: OutlinedSelectProps) {
  const [generatedId] = useState(() => `outlined-select-${++nextId}`);
  const selectId = id || generatedId;

  return (
    <div
      className={classNames('relative flex min-w-0 h-12 font-plain', className)}
    >
      <select
        id={selectId}
        value={selected}
        onChange={e => onChange(e.target.value)}
        style={style}
        className="peer w-full min-w-0 pl-4 pr-12 bg-transparent appearance-none outline-hidden cursor-pointer text-body-large text-on-surface dark:scheme-dark"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.display}
          </option>
        ))}
      </select>
      <fieldset
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -top-[5px] m-0 px-3 min-w-0 text-left rounded-extra-small pointer-events-none border border-outline transition-fast-effects peer-hover:border-on-surface peer-focus:border-2 peer-focus:border-primary"
      >
        {/* The fieldset's -5px top lines its border up with the middle of
            this 11px legend, which cuts the notch for the label. */}
        <legend className="invisible h-[11px] max-w-full p-0 text-body-small whitespace-nowrap overflow-hidden">
          <span className="px-1">{label}</span>
        </legend>
      </fieldset>
      <label
        htmlFor={selectId}
        className="absolute left-4 top-0 max-w-[calc(100%-2rem)] truncate origin-top-left -translate-y-[9px] scale-75 pointer-events-none text-body-large text-on-surface-variant peer-focus:text-primary"
      >
        {label}
      </label>
      <Icon
        name="keyboard_arrow_down"
        className="absolute right-3 top-1/2 w-6 h-6 -translate-y-1/2 pointer-events-none text-on-surface-variant"
      />
    </div>
  );
}
