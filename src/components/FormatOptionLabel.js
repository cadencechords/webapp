import React from 'react';

export default function FormatOptionLabel({ children }) {
  return (
    <div className="mr-3 text-xs font-semibold text-gray-700 dark:text-dark-gray-200">
      {children}
    </div>
  );
}
