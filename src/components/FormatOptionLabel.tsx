import React from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export default function FormatOptionLabel({
  children,
  ...props
}: ComponentPropsWithoutRef<'label'>) {
  return (
    <label
      className="mr-3 text-xs font-semibold text-gray-700 dark:text-dark-gray-200"
      {...props}
    >
      {children}
    </label>
  );
}
