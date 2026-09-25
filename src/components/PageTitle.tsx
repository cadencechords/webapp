type PageTitleProps = {
  title?: string;
  editable?: boolean;
  onChange?: (title: string) => void;
  align?: keyof typeof ALIGNMENTS;
  placeholder?: string;
  className?: string;
};

export default function PageTitle({
  title,
  editable = false,
  onChange,
  align = 'left',
  placeholder,
  className = '',
}: PageTitleProps) {
  if (editable) {
    return (
      <input
        className={
          `bg-transparent appearance-none font-bold p-2 text-2xl w-full outline-hidden ` +
          ` focus:outline-hidden focus:bg-gray-100 hover:bg-gray-100 dark:hover:bg-dark-gray-800 dark:focus:bg-dark-gray-800 rounded-sm transition-colors` +
          ` ${className}`
        }
        value={title || ''}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
    );
  } else {
    return (
      <h1
        className={`p-2 dark:text-dark-gray-100 font-bold flex items-center w-full ${ALIGNMENTS[align]} text-2xl ${className}`}
        id="title"
      >
        {title}
      </h1>
    );
  }
}

const ALIGNMENTS = {
  left: 'justify-left',
  center: 'justify-center',
  right: 'justify-right',
};
