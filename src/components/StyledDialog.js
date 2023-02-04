import { Dialog, Transition } from '@headlessui/react';

import Button from './Button';
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import XIcon from '@heroicons/react/outline/XIcon';

export default function StyledDialog({
  open,
  onCloseDialog,
  title,
  children,
  size,
  showClose,
  fullscreen,
  borderedTop,
}) {
  let sizeClasses = fullscreen
    ? `min-h-screen sm:min-h-full w-full ${SM_MAX_WIDTHS[size]} `
    : ` ${MAX_WIDTHS[size]} w-full `;

  let mobileStyleClasses = fullscreen
    ? ` sm:shadow-xl sm:rounded-xl sm:mt-8 `
    : ` shadow-xl rounded-xl mt-8`;

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className={`fixed inset-0 z-50 max-h-full ${
          fullscreen ? 'mx-0' : 'mx-3'
        }`}
        static
        open={open}
        onClose={onCloseDialog}
      >
        <div className="max-h-full overflow-auto text-center sm:px-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className={`fixed inset-0 bg-black bg-opacity-20`}
            />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={
                `inline-block ${sizeClasses} ${mobileStyleClasses} ` +
                ` overflow-y-auto text-left align-middle transition-all transform bg-white dark:bg-dark-gray-700 `
              }
            >
              {showClose && (
                <span className="absolute top-4 right-4">
                  <Button
                    variant="icon"
                    size="md"
                    onClick={onCloseDialog}
                    tabIndex={1}
                  >
                    <XIcon className="w-4 h-4 text-gray-700 dark:text-dark-gray-200" />
                  </Button>
                </span>
              )}
              <Dialog.Title
                as="h3"
                className={
                  borderedTop ? ` border-b dark:border-dark-gray-400 ` : ''
                }
              >
                <div className="px-3 py-6 text-lg font-semibold leading-6 text-gray-900 whitespace-pre dark:text-dark-gray-100 sm:px-5">
                  {title}
                </div>
              </Dialog.Title>
              <div
                className={`my-2 px-3 sm:px-5 ${
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

StyledDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func.isRequired,
};

StyledDialog.defaultProps = {
  size: 'md',
  showClose: true,
  fullscreen: true,
  borderedTop: true,
};

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

const SM_MAX_WIDTHS = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
};
