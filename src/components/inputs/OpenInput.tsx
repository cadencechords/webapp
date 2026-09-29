import type { FocusEventHandler } from 'react';

type OpenInputProps = {
  placeholder?: string;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  /** Metronome passes its bpm, a number. */
  value?: string | number;
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
      className={`appearance-none outline-hidden w-full focus:outline-hidden bg-transparent text-on-surface placeholder:text-on-surface-variant caret-primary focus:shadow-[inset_0_-2px_0_var(--color-primary)] ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={onFocus}
      autoFocus={autoFocus}
      tabIndex={0}
    />
  );
}
