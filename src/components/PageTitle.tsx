import classNames from 'classnames';

type PageTitleProps = {
  title?: string;
  editable?: boolean;
  onChange?: (title: string) => void;
  align?: keyof typeof ALIGNMENTS;
  placeholder?: string;
  className?: string;
};

// A page's title in headline-small (emphasized), or an input styled like it
// for renaming: a state layer on hover and a filled field while focused.
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
        className={classNames(
          'w-full p-2 bg-transparent appearance-none rounded-small outline-hidden',
          'text-headline-small-emphasized font-plain text-on-surface placeholder:text-on-surface-variant',
          'state-layer-flat focus:bg-surface-container-highest',
          className
        )}
        value={title || ''}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
    );
  } else {
    return (
      <h1
        className={classNames(
          'flex items-center w-full p-2 text-headline-small-emphasized font-plain text-on-surface',
          ALIGNMENTS[align],
          className
        )}
        id="title"
      >
        {title}
      </h1>
    );
  }
}

const ALIGNMENTS = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};
