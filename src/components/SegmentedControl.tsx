import React from 'react';
import classNames from 'classnames';
import {
  connectedButtonClasses,
  connectedGroupClasses,
} from './buttons/connectedButtonGroup';

type SegmentedControlProps = {
  options: string[];
  onChange: (option: string) => void;
  selected: string;
  /** The radio group's name, unique on the page. */
  name?: string;
  size?: SegmentedControlSize;
};

export type SegmentedControlSize = keyof typeof SIZES;

export default function SegmentedControl({
  options,
  onChange,
  selected,
  name = 'segmented-control',
  size = 'md',
}: SegmentedControlProps) {
  return (
    <fieldset id={name} className={classNames(connectedGroupClasses, 'w-full')}>
      {options.map((option, index) => (
        <span key={index} className="flex flex-1">
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
            className={classNames(
              connectedButtonClasses({
                index,
                count: options.length,
                selected: selected === option,
                size: SIZES[size].button,
              }),
              'w-full text-center select-none',
              SIZES[size].label
            )}
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
    button: 'xs',
    label: 'text-label-medium',
  },
  md: {
    button: 's',
    label: 'text-label-large',
  },
} as const;
