import classNames from 'classnames';
import type { ReactNode } from 'react';

type DetailTitleProps = {
  children?: ReactNode;
  className?: string;
};

// A detail's label (a song's artist, key, genres...): M3 title-small on
// surface.
export default function DetailTitle({ children, className }: DetailTitleProps) {
  return (
    <div
      className={classNames(
        'mr-3 font-plain text-title-small text-on-surface',
        className
      )}
    >
      {children}
    </div>
  );
}
