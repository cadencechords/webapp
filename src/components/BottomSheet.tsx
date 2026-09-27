import type { ReactNode } from 'react';
import Button from './Button';
import Icon from './Icon';

type BottomSheetProps = {
  open?: boolean;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
};

export default function BottomSheet({
  open,
  onClose,
  children,
  className = '',
}: BottomSheetProps) {
  return (
    <div
      className={
        `z-30 fixed w-full transition-default-spatial ` +
        `${open ? 'bottom-0' : '-bottom-full'}`
      }
    >
      <div
        // M3 bottom sheet
        className={`rounded-t-extra-large bg-surface-container-low text-on-surface shadow-(--md-sys-elevation-level1) w-full md:w-3/4 lg:w-1/2 max-w-lg mx-auto relative z-30 ${className}`}
      >
        <Button
          variant="icon"
          className="absolute top-2 right-2"
          size="md"
          color="gray"
          onClick={onClose}
        >
          <Icon name="close" className="w-5 h-5" />
        </Button>
        {children}
      </div>
    </div>
  );
}
