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
  const colorStyles = disabled
    ? 'bg-gray-100 dark:bg-dark-gray-700 text-gray-800 dark:text-dark-gray-200'
    : 'text-blue-700 bg-blue-100';
  return (
    <span
      className={`rounded-full h-5 w-5 shrink-0 flex-center text-xs ${colorStyles} ${className}`}
    >
      {children}
    </span>
  );
}
