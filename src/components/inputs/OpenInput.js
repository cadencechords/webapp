export default function OpenInput({
  placeholder,
  onFocus,
  value,
  onChange,
  autoFocus,
  className,
}) {
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

OpenInput.defaultProps = {
  autoFocus: false,
  className: '',
};
