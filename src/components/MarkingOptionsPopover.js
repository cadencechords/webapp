import { Popover } from '@headlessui/react';
import { usePopper } from 'react-popper';
import { useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { noop } from '../utils/constants';
import MobileMenuButton from './buttons/MobileMenuButton';
import TrashIcon from '@heroicons/react/outline/TrashIcon';

export default function MarkingOptionsPopover({
  onDelete,
  button,
  isOpen = true,
  style,
  onClose,
}) {
  const referenceElement = useRef();
  const popperElement = useRef();

  let { styles, attributes } = usePopper(
    referenceElement.current,
    popperElement.current,
    {
      placement: 'bottom-start',
      strategy: 'fixed',
    }
  );

  useOnClickOutside(popperElement, onClose || noop);

  return (
    <Popover>
      {button && (
        <Popover.Button
          className="w-full outline-none focus:outline-none"
          ref={referenceElement}
        >
          {button}
        </Popover.Button>
      )}

      {isOpen && (
        <Popover.Panel
          static={true}
          className={`bg-white dark:bg-dark-gray-700 rounded-lg shadow-2xl z-50 absolute`}
          ref={popperElement}
          style={{ ...styles.popper, ...style }}
          {...attributes.popper}
        >
          <div className="overflow-hidden rounded-lg w-60">
            <MobileMenuButton
              full
              className="border-b dark:border-dark-gray-400 last:border-0 flex-between"
              color="red"
              onClick={onDelete}
            >
              Delete
              <TrashIcon className="w-4 h-4" />
            </MobileMenuButton>
          </div>
        </Popover.Panel>
      )}
    </Popover>
  );
}
