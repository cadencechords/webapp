import type { CSSProperties, ReactNode, SelectHTMLAttributes } from 'react';
import Icon from './Icon';

type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'onChange' | 'value'
> & {
  options?: { value: string | number; display: ReactNode }[];
  selected?: string | number;
  onChange?: (value: string) => void;
  style?: CSSProperties;
  className?: string;
};

export default function Select({
  options = [],
  selected,
  onChange,
  style,
  className = '',
  ...props
}: SelectProps) {
  return (
    <span className="relative">
      <select
        onChange={e => onChange?.(e.target.value)}
        value={selected}
        style={style}
        // M3 filled dropdown field; the options menu is the browser's.
        className={`w-full p-1 pr-4 text-xs font-plain text-on-surface bg-surface-container-highest rounded-t-extra-small state-layer-flat focus:outline-hidden appearance-none dark:scheme-dark shadow-[inset_0_-1px_0_var(--color-on-surface-variant)] focus:shadow-[inset_0_-2px_0_var(--color-primary)] transition-fast-effects ${className}`}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.display}
          </option>
        ))}
      </select>
      <Icon
        name="keyboard_arrow_down"
        filled
        className="absolute w-3 h-3 transform -translate-y-1/2 right-1 top-1/2 text-on-surface-variant pointer-events-none"
      />
    </span>
  );
}
