import classNames from 'classnames';
import { useRef } from 'react';
import Icon from '../Icon';
import { ON_LOWEST_STATE_LAYERS } from '../lists/listItem';

type SearchFieldProps = {
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  autoFocus?: boolean;
  /** Margins and width. */
  className?: string;
  /** The container: high on the page, lowest in a dialog (on a high
      surface, where high would blend in). */
  surface?: 'high' | 'lowest';
};

// An M3 search bar: a 56dp pill on surface-container-high (or -lowest), a search icon and
// the field, and a clear button once there's text. 48dp targets sit 4dp
// from its ends. It fills its container's width.
export default function SearchField({
  onChange,
  value = '',
  placeholder = 'Search',
  autoFocus = false,
  className,
  surface = 'high',
}: SearchFieldProps) {
  const input = useRef<HTMLInputElement>(null);

  return (
    <div
      className={classNames(
        'flex items-center w-full h-14 px-1 rounded-full font-plain state-layer-flat',
        surface === 'lowest'
          ? `bg-surface-container-lowest dark:bg-surface-container-high ${ON_LOWEST_STATE_LAYERS}`
          : 'bg-surface-container-high',
        className
      )}
      onClick={() => input.current?.focus()}
    >
      <span className="flex-center w-12 h-12 shrink-0 text-on-surface">
        <Icon name="search" className="w-6 h-6" />
      </span>
      <input
        ref={input}
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoFocus={autoFocus}
        className="flex-1 min-w-0 h-full px-1 bg-transparent outline-none text-body-large text-on-surface placeholder:text-on-surface-variant caret-primary [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          className="flex-center w-12 h-12 shrink-0 rounded-full text-on-surface-variant state-layer-flat focus-ring"
          onClick={event => {
            event.stopPropagation();
            onChange('');
            input.current?.focus();
          }}
        >
          <Icon name="close" className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
