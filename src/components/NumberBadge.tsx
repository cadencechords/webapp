import React from 'react';

import type { ReactNode } from 'react';

type NumberBadgeProps = {
  children: ReactNode;
  className: string;
  disabled?: boolean;
};

export default function NumberBadge({
  children,
  className,
  disabled,
}: NumberBadgeProps) {
  // An M3 large badge: a count on the error color.
  const colorStyles = disabled
    ? 'bg-on-surface/12 text-on-surface/38'
    : 'bg-error text-on-error';
  return (
    <span
      className={`rounded-full h-4 min-w-4 px-1 shrink-0 flex-center font-plain text-label-small ${colorStyles} ${className}`}
    >
      {children}
    </span>
  );
}
