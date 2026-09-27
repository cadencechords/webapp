import { Dialog, Transition } from '@headlessui/react';

import Button from './Button';
import { Fragment, type ReactNode } from 'react';
import classNames from 'classnames';
import Icon from './Icon';

export type DialogSize = keyof typeof MAX_WIDTHS;

type StyledDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
  title?: ReactNode;
  children?: ReactNode;
  size?: DialogSize;
  showClose?: boolean;
  fullscreen?: boolean;
  borderedTop?: boolean;
  className?: string;
};

export default function StyledDialog({
  open,
  onCloseDialog,
  title,
  children,
  size = 'md',
  showClose = true,
  fullscreen = true,
  borderedTop = true,
  className,
}: StyledDialogProps) {
  const sizeClasses = fullscreen
    ? `min-h-screen sm:min-h-full w-full ${SM_MAX_WIDTHS[size]} `
    : ` ${MAX_WIDTHS[size]} w-full `;

  // M3 basic dialog; a fullscreen one is an M3 full-screen dialog (the
  // surface, no corners) below sm. my-8 leaves room for the shadow inside
  // the scrolling container, which would clip it at the panel's edge.
  const mobileStyleClasses = fullscreen
    ? ` bg-surface sm:bg-surface-container-high sm:shadow-(--md-sys-elevation-level3) sm:rounded-extra-large sm:my-8 `
    : ` bg-surface-container-high shadow-(--md-sys-elevation-level3) rounded-extra-large my-8`;

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className={classNames(
          `fixed inset-0 z-50 max-h-full ${fullscreen ? 'mx-0' : 'mx-3'}`,
          className
        )}
        static
        open={open}
        onClose={onCloseDialog}
      >
        <div className="max-h-full overflow-auto text-center sm:px-4">
          <Transition.Child
            as={Fragment}
            enter="transition-default-effects"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-fast-effects"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-scrim/32" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block align-middle" aria-hidden="true">
            &#8203;
          </span>
          {/* Scale on the default-spatial spring, fade on default-effects */}
          <Transition.Child
            as={Fragment}
            enter="transition-dialog-enter"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="transition-dialog-exit"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={
                `inline-block ${sizeClasses} ${mobileStyleClasses} ` +
                ` relative overflow-y-auto text-left align-middle font-plain text-on-surface `
              }
            >
              {showClose && (
                <span className="absolute top-4 right-4">
                  <Button
                    variant="icon"
                    size="md"
                    color="gray"
                    onClick={onCloseDialog}
                    tabIndex={1}
                  >
                    <Icon name="close" className="w-6 h-6" />
                  </Button>
                </span>
              )}
              <Dialog.Title
                as="h3"
                className={
                  borderedTop ? ` border-b border-outline-variant ` : ''
                }
              >
                <div
                  className={classNames(
                    // pre-wrap: keeps the title's line breaks, but wraps inside the
                    // padding instead of running under the close button
                    'px-4 py-6 text-headline-small text-on-surface whitespace-pre-wrap break-words sm:px-6',
                    // Room for the close button
                    showClose && 'pr-16 sm:pr-16'
                  )}
                >
                  {title}
                </div>
              </Dialog.Title>
              <div
                className={`my-2 px-4 sm:px-6 ${
                  borderedTop ? ' py-4 ' : ' pb-6 pt-0 '
                }`}
              >
                {children}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

const MAX_WIDTHS = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
};

const SM_MAX_WIDTHS: Record<DialogSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
};
