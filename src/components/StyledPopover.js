import { Popover } from '@headlessui/react';
import { usePopper } from 'react-popper';
import { useState } from 'react';

export default function StyledPopover({
  children,
  button,
  position,
  className,
}) {
  let [referenceElement, setReferenceElement] = useState();
  let [popperElement, setPopperElement] = useState();

  let { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: position,
    strategy: 'fixed',
  });

  return (
    <Popover>
      <Popover.Button
        className="w-full outline-none focus:outline-none"
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

StyledPopover.defaultProps = {
  className: '',
};
