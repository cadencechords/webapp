import type { FocusEventHandler } from 'react';

type OpenInputProps = {
  placeholder?: string;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  value?: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  className?: string;
};

export default function OpenInput({
  placeholder,
  onFocus,
  value,
  onChange,
  autoFocus = false,
  className = '',
}: OpenInputProps) {
  return (
    <input
      className={`appearance-none outline-hidden w-full focus:outline-hidden bg-transparent ${className} dark:text-dark-gray-100`}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={onFocus}
      autoFocus={autoFocus}
      tabIndex={0}
    />
  );
}
