import React from 'react';

export default function SegmentedControl({
  options,
  onChange,
  selected,
  name = 'segmented-control',
  size = 'md',
}) {
  return (
    <fieldset
      id={name}
      className={`flex items-center w-full ${SIZES[size].container} bg-gray-100 rounded-full dark:bg-dark-gray-600`}
    >
      {options.map((option, index) => (
        <span key={index} className="flex-1 p-1 flex-center">
          <input
            type="radio"
            name={name}
            className="hidden w-0 h-0"
            id={`${name}-segmented-control-${option}`}
            checked={selected === option}
            value={option}
            onChange={e => onChange(e.target.value)}
          />
          <label
            className={`flex-center w-full text-center inline-block ${
              SIZES[size].label
            } select-none font-medium ${
              selected === option
                ? 'bg-white dark:bg-dark-gray-700 rounded-full shadow-sm'
                : ''
            }`}
            htmlFor={`${name}-segmented-control-${option}`}
          >
            {option}
          </label>
        </span>
      ))}
    </fieldset>
  );
}

const SIZES = {
  sm: {
    container: 'h-7',
    label: 'text-xs h-5',
  },
  md: {
    container: 'h-8',
    label: 'text-sm h-6',
  },
};
