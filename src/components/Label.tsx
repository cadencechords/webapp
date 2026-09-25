import type { ReactNode } from 'react';

type LabelProps = { children?: ReactNode; className?: string };

export default function Label({ children, className }: LabelProps) {
  return (
    <div
      className={
        'mb-2 font-semibold text-sm text-gray-700 dark:text-dark-gray-200 ' +
        className
      }
    >
      {children}
    </div>
  );
}
