import React from 'react';

export default function FormatOptionLabel({ children, ...props }) {
  return (
    <label
      className="mr-3 text-xs font-semibold text-gray-700 dark:text-dark-gray-200"
      {...props}
    >
      {children}
    </label>
  );
}
