type WellInputProps = {
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  id?: string;
};

export default function WellInput({
  onChange,
  value,
  placeholder = 'Search',
  autoFocus = false,
  className = '',
  id = '',
}: WellInputProps) {
  return (
    // M3 filled text field: the active indicator is an inset shadow, so the
    // field stays a single <input> and className still reaches it.
    <input
      className={`appearance-none font-plain text-body-large bg-surface-container-highest text-on-surface placeholder:text-on-surface-variant caret-primary rounded-t-extra-small state-layer-flat outline-hidden focus:outline-hidden w-full px-4 py-3 shadow-[inset_0_-1px_0_var(--color-on-surface-variant)] hover:shadow-[inset_0_-1px_0_var(--color-on-surface)] focus:shadow-[inset_0_-2px_0_var(--color-primary)] transition-fast-effects ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      autoFocus={autoFocus}
      id={id}
    />
  );
}
