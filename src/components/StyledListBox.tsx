import type { ReactNode } from 'react';
import { Listbox } from '@headlessui/react';
import classNames from 'classnames';
import Icon from './Icon';

type ListBoxOption<T> = { value: T; template: ReactNode };

type StyledListBoxProps<T> = {
  options?: ListBoxOption<T>[];
  onChange?: (value: T) => void;
  selectedOption: ListBoxOption<T>;
  // 'white' is a surface-container-lowest field; anything else is transparent
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
          // M3 exposed dropdown menu: an outlined field and a menu surface
          className={({ open }) =>
            classNames(
              'px-3 py-2 h-8 w-full text-left flex-between font-plain text-body-medium text-on-surface rounded-extra-small outline-hidden focus:outline-hidden transition-fast-effects',
              open
                ? 'border border-primary shadow-[inset_0_0_0_1px_var(--color-primary)]'
                : 'border border-outline hover:border-on-surface focus-visible:border-primary focus-visible:shadow-[inset_0_0_0_1px_var(--color-primary)]',
              background === 'white'
                ? 'bg-surface-container-lowest'
                : 'bg-transparent'
            )
          }
        >
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            {selectedOption.template}
          </div>
          <Icon
            name="unfold_more"
            filled
            className="shrink-0 w-4 h-4 text-on-surface-variant"
          />
        </Listbox.Button>
        <Listbox.Options
          className={classNames(
            'overflow-auto w-full mt-1 py-2 rounded-large bg-surface-container shadow-[var(--md-sys-elevation-level2)] font-plain text-body-medium text-on-surface outline-hidden focus:outline-hidden z-50 max-h-40',
            !relative && 'absolute'
          )}
        >
          {options?.map((option, index) => (
            <Listbox.Option
              key={index}
              value={option.value}
              className={({ active, selected }) =>
                classNames(
                  'px-3 py-1 min-h-10 flex items-center cursor-pointer',
                  selected &&
                    'bg-secondary-container text-on-secondary-container',
                  // State layer: on-surface at 8% over the item
                  active &&
                    !selected &&
                    'bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)]'
                )
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
