import type { ReactNode } from 'react';
import Icon from './Icon';
import { MenuItem, MenuList } from './Menu';
import StyledPopover from './StyledPopover';

type MenuSelectProps<T extends string> = {
  options: { value: T; display: ReactNode }[];
  /** Unset shows no current choice. */
  selected?: T;
  onChange: (value: T) => void;
  /** Shown before the current choice, like "Key:". */
  label?: string;
  /** The menu's width, e.g. "w-56". */
  menuClassName?: string;
};

// Picking one of a few options: an M3E tonal menu button (40px, round,
// squaring while pressed) showing the current choice, opening an M3E menu
// with that choice selected and checked.
export default function MenuSelect<T extends string>({
  options,
  selected,
  onChange,
  label,
  menuClassName = 'w-56',
}: MenuSelectProps<T>) {
  const current = options.find(option => option.value === selected);

  return (
    <StyledPopover
      position="bottom-end"
      buttonClassName="group flex items-center gap-2 h-10 pl-4 pr-2 rounded-[20px] [--shape-morph-to:8px] bg-surface-container-highest text-on-surface font-plain state-layer-flat focus-ring shape-morph"
      button={
        <>
          {label && (
            <span className="text-label-large text-on-surface-variant">
              {label}
            </span>
          )}
          <span className="text-label-large">{current?.display}</span>
          <Icon
            name="keyboard_arrow_down"
            className="w-5 h-5 text-on-surface-variant transition-transform group-aria-expanded:rotate-180"
          />
        </>
      }
    >
      <MenuList className={menuClassName}>
        {options.map(option => (
          <MenuItem
            key={option.value}
            selected={option.value === selected}
            trailing={
              option.value === selected && (
                <Icon name="check" className="w-5 h-5" />
              )
            }
            onClick={() => onChange(option.value)}
          >
            {option.display}
          </MenuItem>
        ))}
      </MenuList>
    </StyledPopover>
  );
}
