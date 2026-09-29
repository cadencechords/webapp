import type { ReactNode } from 'react';

type LabelProps = { children?: ReactNode; className?: string };

export default function Label({ children, className }: LabelProps) {
  return (
    <div
      className={
        'mb-2 font-plain text-label-large text-on-surface-variant ' + className
      }
    >
      {children}
    </div>
  );
}
