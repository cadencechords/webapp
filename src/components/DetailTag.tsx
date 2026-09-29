import classNames from 'classnames';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

type DetailTagProps = {
  children: ReactNode;
  /** Before the label, e.g. a folder's color. */
  leading?: ReactNode;
  /** Makes the chip a link. */
  to?: string;
  /** Shows a trailing remove button. */
  onRemove?: () => void;
  /** The remove button's accessible name. */
  removeLabel?: string;
};

// An M3 input chip on surface-container-highest, with no outline, small
// corners. 28dp tall, a step under M3's 32dp. The label has 10dp before it; a remove
// button takes the trailing 4dp instead, with its own state layer.
export default function DetailTag({
  children,
  leading,
  to,
  onRemove,
  removeLabel = 'Remove',
}: DetailTagProps) {
  const label = (
    <>
      {leading}
      <span className="truncate">{children}</span>
    </>
  );
  const labelClasses = classNames(
    'flex items-center gap-1.5 h-full min-w-0 pl-2.5',
    onRemove ? 'pr-0.5' : 'pr-2.5'
  );

  return (
    <span className="inline-flex items-center h-7 max-w-full rounded-small bg-surface-container-highest font-plain text-body-small text-on-surface">
      {to ? (
        <Link
          to={to}
          className={classNames(
            labelClasses,
            'rounded-small state-layer focus-ring'
          )}
        >
          {label}
        </Link>
      ) : (
        <span className={labelClasses}>{label}</span>
      )}
      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className="flex-center shrink-0 w-5 h-5 mr-1 rounded-full state-layer focus-ring"
        >
          <Icon name="close" className="w-4 h-4" />
        </button>
      )}
    </span>
  );
}
