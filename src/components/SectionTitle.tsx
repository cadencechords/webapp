import classNames from 'classnames';
import type { ReactNode } from 'react';

type SectionTitleProps = {
  title?: ReactNode;
  underline?: boolean;
  className?: string;
};

// A section's heading in title-large, optionally over an outline-variant
// divider.
export default function SectionTitle({
  title,
  underline,
  className = '',
}: SectionTitleProps) {
  return (
    <h2
      className={classNames(
        'mt-3 mb-2 text-title-large font-plain text-on-surface',
        underline && 'border-b border-outline-variant pb-2',
        className
      )}
    >
      {title}
    </h2>
  );
}
