import type { ReactNode } from 'react';
import { Listbox } from '@headlessui/react';
import Icon from './Icon';

type ListBoxOption<T> = { value: T; template: ReactNode };

type StyledListBoxProps<T> = {
  options?: ListBoxOption<T>[];
  onChange?: (value: T) => void;
  selectedOption: ListBoxOption<T>;
  // 'white', or a Tailwind color name used as bg-<name>-200
  background?: string;
  relative?: boolean;
};

export default function StyledListBox<T>({
  options,
  onChange,
  selectedOption,
  background = 'transparent',
  relative,
}: StyledListBoxProps<T>) {
  return (
    <Listbox value={selectedOption.value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button
          className={
            `transition-all px-3 py-2 shadow-xs h-8 text-left border-gray-300 dark:border-dark-gray-400 focus:outline-hidden outline-hidden ` +
            ` w-full border rounded-md focus:ring-offset-1 focus:ring-2 focus:ring-blue-400 dark:focus:ring-offset-dark-gray-700 flex-between` +
            ` ${
              background === 'white'
                ? 'bg-white dark:bg-dark-gray-900 '
                : ' bg-' + background + '-200'
            }`
          }
        >
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            {selectedOption.template}
          </div>
          <Icon
            name="unfold_more"
            filled
            className="shrink-0 w-4 h-4 text-gray-500"
          />
        </Listbox.Button>
        <Listbox.Options
          className={
            `overflow-auto bg-white dark:bg-dark-gray-600 shadow-xl w-full rounded-md mt-1 py-2 ` +
            `${relative ? '' : 'absolute'} z-50 max-h-40`
          }
        >
          {options?.map((option, index) => (
            <Listbox.Option
              key={index}
              value={option.value}
              className={({ active, selected }) =>
                `${
                  active || selected ? 'bg-gray-100 dark:bg-dark-gray-400' : ''
                } px-3 py-1 hover:bg-gray-100 flex items-center`
              }
            >
              {option.template}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
