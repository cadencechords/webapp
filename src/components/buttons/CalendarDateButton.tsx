import classNames from 'classnames';
import type { ReactNode } from 'react';

type CalendarDateButtonProps = {
  /** Today: filled with primary. */
  selected: boolean;
  children: ReactNode;
  className: string;
};

// A day's number in a calendar cell, in a 28dp circle; today's is filled
// with primary. Not interactive: the cell's events are.
export default function CalendarDateButton({
  selected,
  children,
  className,
}: CalendarDateButtonProps) {
  return (
    <span
      aria-current={selected ? 'date' : undefined}
      className={classNames(
        'inline-flex items-center justify-center w-7 h-7 rounded-full font-plain text-label-large',
        selected ? 'bg-primary text-on-primary' : 'text-on-surface',
        className
      )}
    >
      {children}
    </span>
  );
}
