import type { ReactNode } from 'react';
import Icon from './Icon';
import type { OutlinedIconName } from './icons/registry';
import LoadingIndicator from './feedback/LoadingIndicator';
import { SHAPE_PATHS } from './feedback/loadingShapes';

type NoDataMessageProps = {
  /** What there's none of, e.g. "songs" shows "No songs to show". */
  type?: string;
  /** The message, when there's no `type`. */
  children?: ReactNode;
  /** A line (or an action) under the message. */
  description?: ReactNode;
  icon?: OutlinedIconName;
  loading?: boolean;
  /** One line with a small cookie, for a section, a dialog or a sheet: the
      large empty state is for a page's main list. */
  compact?: boolean;
};

// The 9-sided cookie, one of the loading indicator's official shapes
// (non-null: only the last, the oval, is generated).
const COOKIE = SHAPE_PATHS[1]!;

// An M3 Expressive empty state: an icon in a large cookie shape over a
// headline-small message and an optional body-medium description, or a
// compact one-line version. While `loading`, the loading indicator instead.
export default function NoDataMessage({
  type,
  children,
  description,
  icon = 'inbox',
  loading,
  compact = false,
}: NoDataMessageProps) {
  // type wins over children, as before.
  const message = type
    ? `No ${type} to show`
    : (children ?? 'No items to show');

  if (loading) {
    return (
      <div className="flex justify-center py-2">
        <LoadingIndicator size={compact ? 32 : 48} />
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-1 px-2 py-3 text-center">
        <div className="flex items-center gap-3 text-body-medium text-on-surface-variant">
          <Cookie className="w-10 h-10" iconClassName="w-5 h-5" icon={icon} />
          <span>{message}</span>
        </div>
        {description && (
          <div className="text-body-medium text-on-surface-variant">
            {description}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-6 text-center">
      <Cookie className="w-24 h-24" iconClassName="w-10 h-10" icon={icon} />
      <div className="text-headline-small font-plain text-on-surface">
        {message}
      </div>
      {description && (
        <div className="text-body-medium text-on-surface-variant">
          {description}
        </div>
      )}
    </div>
  );
}

// The icon in the cookie shape, on primary-container.
function Cookie({
  className,
  iconClassName,
  icon,
}: {
  className: string;
  iconClassName: string;
  icon: OutlinedIconName;
}) {
  return (
    <div
      className={`relative flex-center shrink-0 text-on-primary-container ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${COOKIE.viewBox} ${COOKIE.viewBox}`}
        className="absolute inset-0 w-full h-full fill-primary-container"
      >
        <path d={COOKIE.d} />
      </svg>
      <Icon name={icon} className={`relative ${iconClassName}`} />
    </div>
  );
}
