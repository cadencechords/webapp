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
        className={`w-full p-1 text-xs transition-colors focus:outline-hidden bg-gray-100 dark:bg-dark-gray-600 rounded-md hover:bg-gray-200 focus:bg-gray-200 focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 appearance-none dark:focus:ring-offset-dark-gray-700 ${className}`}
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
        className="absolute w-3 h-3 transform -translate-y-1/2 right-1 top-1/2"
      />
    </span>
  );
}
