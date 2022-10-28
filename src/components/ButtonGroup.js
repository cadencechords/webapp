import React from 'react';

export default function ButtonGroup({ options = [], selected = [], onChange }) {
  function isNotLastOption(index) {
    return index !== options.length - 1;
  }

  function isSelected(option) {
    return selected.includes(option.value);
  }

  function handleClick(option) {
    const newSelectedValues = isSelected(option)
      ? selected.filter(selectedValue => selectedValue !== option.value)
      : [...selected, option.value];

    onChange?.(newSelectedValues);
  }

  function isFirst(index) {
    return index === 0;
  }

  function isLast(index) {
    return index === options.length - 1;
  }
  return (
    <div className="flex w-full bg-gray-100 rounded-md dark:bg-dark-gray-600">
      {options.map((option, index) => (
        <button
          onClick={() => handleClick(option)}
          className={
            `flex-1 py-1  flex-center ` +
            ` ${
              isNotLastOption(index) && 'border-r dark:border-dark-gray-400'
            } ` +
            ` ${
              isSelected(option) ? 'bg-gray-700 text-white' : 'text-gray-600'
            } ` +
            ` 
            ${isFirst(index) && 'rounded-l-md'} ` +
            ` ${isLast(index) && 'rounded-r-md'}`
          }
          key={index}
        >
          {option.display}
        </button>
      ))}
    </div>
  );
}
