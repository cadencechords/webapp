import { Popover, Transition } from '@headlessui/react';
import { usePopper } from 'react-popper';
import { Fragment, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { noop } from '../utils/constants';
import { MenuItem, MenuList } from './Menu';
import { MENU_SURFACE, transformOrigin } from './StyledPopover';
import Icon from './Icon';

type MarkingOptionsPopoverProps = {
  onDelete: () => void;
  button?: ReactNode;
  isOpen?: boolean;
  style?: CSSProperties;
  onClose?: () => void;
};

export default function MarkingOptionsPopover({
  onDelete,
  button,
  isOpen = true,
  style,
  onClose,
}: MarkingOptionsPopoverProps) {
  // usePopper takes the elements as state (react-popper's documented usage),
  // so it runs again once they mount. useOnClickOutside takes a ref.
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const popperRef = useRef<HTMLDivElement | null>(null);

  const { styles, attributes, state } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: 'bottom-start',
      strategy: 'fixed',
    }
  );

  useOnClickOutside(popperRef, onClose || noop);

  return (
    <Popover>
      {button && (
        <Popover.Button
          className="w-full outline-hidden focus:outline-hidden"
          ref={setReferenceElement}
        >
          {button}
        </Popover.Button>
      )}

      <Transition
        show={isOpen}
        appear
        as={Fragment}
        enter="transition-menu-enter"
        enterFrom="opacity-0 scale-90"
        enterTo="opacity-100 scale-100"
        leave="transition-menu-exit pointer-events-none"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          static={true}
          className={`${MENU_SURFACE} z-50 absolute`}
          ref={(element: HTMLDivElement | null) => {
            popperRef.current = element;
            setPopperElement(element);
          }}
          style={{
            ...styles.popper,
            transformOrigin: transformOrigin(state?.placement),
            ...style,
          }}
          {...attributes.popper}
        >
          <MenuList className="w-60">
            <MenuItem
              destructive
              onClick={onDelete}
              icon={<Icon name="delete" />}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
