import { Fragment, type ReactNode } from 'react';
import { Popover, Transition } from '@headlessui/react';
import type { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';
import { useState } from 'react';
import classNames from 'classnames';

type StyledPopoverProps = {
  children?: ReactNode;
  button?: ReactNode;
  position?: Placement;
  className?: string;
};

// An M3 menu surface under (or beside) its button. It scales and fades in
// from the side of the button, wherever popper placed it.
export default function StyledPopover({
  children,
  button,
  position,
  className = '',
}: StyledPopoverProps) {
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>();
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>();

  const { styles, attributes, state } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: position,
      strategy: 'fixed',
      modifiers: POPPER_MODIFIERS,
    }
  );

  return (
    <Popover>
      <Popover.Button
        className="w-full outline-hidden focus:outline-hidden"
        ref={setReferenceElement}
      >
        {button}
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition-menu-enter"
        enterFrom="opacity-0 scale-90"
        enterTo="opacity-100 scale-100"
        leave="transition-menu-exit pointer-events-none"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          className={classNames(MENU_SURFACE, 'z-50', className)}
          ref={setPopperElement}
          style={{
            ...styles.popper,
            transformOrigin: transformOrigin(state?.placement ?? position),
          }}
          {...attributes.popper}
        >
          {children}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

/** The menu container: surface-container, large corners, level 2. It
    doesn't clip, so a color picker's handles can reach past its padding. */
export const MENU_SURFACE =
  'bg-surface-container text-on-surface rounded-large shadow-(--md-sys-elevation-level2)';

/** Popper places the menu with top/left rather than a transform: the
    enter/exit `scale` composes with `transform`, so it would scale popper's
    translate too and slide the menu in from the viewport's corner. */
export const POPPER_MODIFIERS = [
  { name: 'computeStyles', options: { gpuAcceleration: false } },
];

/** The corner or edge of the menu nearest its button, to grow from. */
export function transformOrigin(placement: Placement = 'bottom') {
  const [side, alignment] = placement.split('-');
  const from = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[
    side
  ];
  const vertical = side === 'top' || side === 'bottom';
  const across =
    alignment === 'start'
      ? vertical
        ? 'left'
        : 'top'
      : alignment === 'end'
        ? vertical
          ? 'right'
          : 'bottom'
        : 'center';
  return vertical ? `${across} ${from}` : `${from} ${across}`;
}
