import classNames from 'classnames';
import type { ReactNode } from 'react';
import Icon from './Icon';

type BottomSheetProps = {
  open?: boolean;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
};

// An M3 standard bottom sheet (no scrim, so the song stays usable behind
// it): large top corners, a drag handle, and a close icon button at the top
// right, beside the content's SheetHeader.
export default function BottomSheet({
  open,
  onClose,
  children,
  className = '',
}: BottomSheetProps) {
  return (
    <div
      className={
        `z-30 fixed w-full transition-sheet ` +
        `${open ? 'bottom-0' : '-bottom-full'}`
      }
    >
      <div
        className={classNames(
          'relative w-full max-w-lg mx-auto md:w-3/4 lg:w-1/2 z-30',
          'rounded-t-extra-large bg-surface-container-low text-on-surface shadow-(--md-sys-elevation-level1)',
          'px-6 pb-[max(2rem,env(safe-area-inset-bottom))]',
          className
        )}
      >
        <div className="flex justify-center pt-4 pb-2" aria-hidden="true">
          <div className="w-8 h-1 rounded-full bg-on-surface-variant/40" />
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-6 right-3 flex-center w-12 h-12 rounded-full text-on-surface-variant state-layer-flat focus-ring"
        >
          <Icon name="close" className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
}
