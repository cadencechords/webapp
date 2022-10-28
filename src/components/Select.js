import React from 'react';

export default function Select({
  options = [],
  selected,
  onChange,
  className = '',
}) {
  return (
    <select
      onChange={e => onChange?.(e.target.value)}
      value={selected}
      style={{ fontFamily: selected }}
      className={`w-full p-1 text-xs transition-colors bg-gray-100 dark:bg-dark-gray-600 rounded-md hover:bg-gray-200 focus:bg-gray-200 ${className}`}
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.display}
        </option>
      ))}
    </select>
  );
}
