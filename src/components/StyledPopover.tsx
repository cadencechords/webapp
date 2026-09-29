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
  /** Classes for the trigger button itself, when it's styled as the
      control instead of wrapping one. */
  buttonClassName?: string;
  /** ARIA state for the trigger, e.g. a toggle's aria-pressed. */
  buttonProps?: { 'aria-pressed'?: boolean; 'aria-label'?: string };
  /** Close when a menu item is chosen (the default). Off for a menu whose
      items lead on to more of the popover, like the key options. */
  closeOnSelect?: boolean;
};

// An M3 menu surface under (or beside) its button. It scales and fades in
// from the side of the button, wherever popper placed it.
export default function StyledPopover({
  children,
  button,
  position,
  className = '',
  buttonClassName = 'w-full outline-hidden focus:outline-hidden',
  buttonProps,
  closeOnSelect = true,
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
      {({ close }) => (
        <>
          <Popover.Button
            className={buttonClassName}
            ref={setReferenceElement}
            {...buttonProps}
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
              className={classNames(
                MENU_SURFACE,
                SURFACE_FOR_GROUPS,
                'z-50',
                className
              )}
              ref={setPopperElement}
              style={{
                ...styles.popper,
                transformOrigin: transformOrigin(state?.placement ?? position),
              }}
              {...attributes.popper}
              // Choosing a menu item closes the menu (a link doesn't unmount it:
              // the rail stays put across pages). In the capture phase: a
              // router link's click never reaches a bubbling onClick here.
              onClickCapture={event => {
                if (
                  closeOnSelect &&
                  (event.target as Element).closest('[data-menu-item]')
                )
                  close();
              }}
            >
              {children}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

/** The menu container: surface-container-high, large corners, level 1. It
    doesn't clip, so a color picker's handles can reach past its padding. */
export const MENU_SURFACE =
  'bg-surface-container-high text-on-surface rounded-large shadow-(--md-sys-elevation-level1)';

/** A grouped (disconnected) MenuList draws a surface per group, so the
    popover's own surface steps aside for it. */
export const SURFACE_FOR_GROUPS =
  'has-[>[data-menu-groups]]:bg-transparent has-[>[data-menu-groups]]:shadow-none';

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
