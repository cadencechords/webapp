import type { ReactNode } from 'react';
import Icon from './Icon';
import type { OutlinedIconName } from './icons/registry';
import LoadingIndicator from './feedback/LoadingIndicator';
import { SHAPE_PATHS } from './feedback/loadingShapes';

type NoDataMessageProps = {
  /** What there's none of, e.g. "songs" shows "No songs to show". */
  type?: string;
  /** The message, in place of `type`'s. */
  children?: ReactNode;
  /** A line (or an action) under the message. */
  description?: ReactNode;
  icon?: OutlinedIconName;
  loading?: boolean;
};

// The 9-sided cookie, one of the loading indicator's official shapes
// (non-null: only the last, the oval, is generated).
const COOKIE = SHAPE_PATHS[1]!;

// An M3 Expressive empty state: an icon in a large cookie shape over a
// headline-small message and an optional body-medium description. While
// `loading`, the loading indicator instead.
export default function NoDataMessage({
  type,
  children,
  description,
  icon = 'inbox',
  loading,
}: NoDataMessageProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-2">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-6 text-center">
      <div className="relative flex-center w-24 h-24 text-on-primary-container">
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${COOKIE.viewBox} ${COOKIE.viewBox}`}
          className="absolute inset-0 w-full h-full fill-primary-container"
        >
          <path d={COOKIE.d} />
        </svg>
        <Icon name={icon} className="relative w-10 h-10" />
      </div>
      <div className="text-headline-small font-plain text-on-surface">
        {children ?? (type ? `No ${type} to show` : 'No items to show')}
      </div>
      {description && (
        <div className="text-body-medium text-on-surface-variant">
          {description}
        </div>
      )}
    </div>
  );
}
