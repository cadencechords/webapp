import React from 'react';
import type { ReactNode } from 'react';

export type ButtonGroupOption<Value> = {
  value: Value;
  display: ReactNode;
};

/** A click on an option: `selected` is whether it becomes selected. */
export type ButtonGroupChange<Value> = {
  selected: boolean;
  option: ButtonGroupOption<Value>;
};

type ButtonGroupProps<Value> = {
  options?: ButtonGroupOption<Value>[];
  /** The values of the selected options. */
  selected?: Value[];
  onChange?: (change: ButtonGroupChange<Value>) => void;
};

export default function ButtonGroup<Value>({
  options = [],
  selected = [],
  onChange,
}: ButtonGroupProps<Value>) {
  function isNotLastOption(index: number) {
    return index !== options.length - 1;
  }

  function isSelected(option: ButtonGroupOption<Value>) {
    return selected.includes(option.value);
  }

  function handleClick(option: ButtonGroupOption<Value>) {
    onChange?.({ selected: !isSelected(option), option });
  }

  function isFirst(index: number) {
    return index === 0;
  }

  function isLast(index: number) {
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
