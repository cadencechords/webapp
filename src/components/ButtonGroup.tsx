import React from 'react';
import classNames from 'classnames';
import type { ReactNode } from 'react';
import {
  connectedButtonClasses,
  connectedGroupClasses,
} from './buttons/connectedButtonGroup';

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
  function isSelected(option: ButtonGroupOption<Value>) {
    return selected.includes(option.value);
  }

  function handleClick(option: ButtonGroupOption<Value>) {
    onChange?.({ selected: !isSelected(option), option });
  }

  return (
    <div className={classNames(connectedGroupClasses, 'w-full')}>
      {options.map((option, index) => (
        <button
          onClick={() => handleClick(option)}
          className={connectedButtonClasses({
            index,
            count: options.length,
            selected: isSelected(option),
            size: 'xs',
          })}
          key={index}
        >
          {option.display}
        </button>
      ))}
    </div>
  );
}
