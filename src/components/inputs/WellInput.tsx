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
    <input
      className={`appearance-none bg-gray-100 dark:bg-dark-gray-800 dark:hover:bg-dark-gray-700 dark:focus:bg-dark-gray-700 rounded-lg outline-hidden focus:outline-hidden w-full px-3 py-2 hover:bg-gray-200 transition-all focus:bg-gray-200 ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      autoFocus={autoFocus}
      id={id}
    />
  );
}
