import React from 'react';
import ChevronDownIcon from '@heroicons/react/solid/ChevronDownIcon';

export default function Select({
  options = [],
  selected,
  onChange,
  style,
  className = '',
}) {
  return (
    <span className="relative">
      <select
        onChange={e => onChange?.(e.target.value)}
        value={selected}
        style={style}
        className={`w-full p-1 text-xs transition-colors focus:outline-none bg-gray-100 dark:bg-dark-gray-600 rounded-md hover:bg-gray-200 focus:bg-gray-200 focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 appearance-none dark:focus:ring-offset-dark-gray-700 ${className}`}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.display}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="absolute w-3 h-3 transform -translate-y-1/2 right-1 top-1/2" />
    </span>
  );
}
