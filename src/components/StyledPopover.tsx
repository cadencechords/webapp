import type { ReactNode } from 'react';
import { Popover } from '@headlessui/react';
import type { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';
import { useState } from 'react';

type StyledPopoverProps = {
  children?: ReactNode;
  button?: ReactNode;
  position?: Placement;
  className?: string;
};

export default function StyledPopover({
  children,
  button,
  position,
  className = '',
}: StyledPopoverProps) {
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>();
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>();

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: position,
    strategy: 'fixed',
  });

  return (
    <Popover>
      <Popover.Button
        className="w-full outline-hidden focus:outline-hidden"
        ref={setReferenceElement}
      >
        {button}
      </Popover.Button>

      <Popover.Panel
        className={`bg-white dark:bg-dark-gray-700 rounded-lg shadow-2xl z-50 ${className}`}
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        {children}
      </Popover.Panel>
    </Popover>
  );
}
