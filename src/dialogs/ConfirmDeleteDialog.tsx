import Button from '../components/Button';
import StyledDialog from '../components/StyledDialog';
import { useState } from 'react';
import type { ReactNode } from 'react';

type ConfirmDeleteDialogProps = {
  onConfirm?: () => void;
  onCancel: () => void;
  show: boolean;
  onCloseDialog: () => void;
  /** Defaults to "Deleting this item is irreversible." */
  children?: ReactNode;
};

export default function ConfirmDeleteDialog({
  onConfirm,
  onCancel,
  show,
  onCloseDialog,
  children,
}: ConfirmDeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    onConfirm?.();
  };

  return (
    <StyledDialog
      title="Are you sure?"
      open={show}
      onCloseDialog={onCloseDialog}
      fullscreen={false}
      borderedTop={false}
    >
      <div className="mb-6">
        {children ? children : 'Deleting this item is irreversible.'}
      </div>
      <div className="flex gap-2">
        <Button full color="red" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          full
          variant="open"
          color="gray"
          onClick={handleConfirm}
          loading={loading}
        >
          Yes, delete
        </Button>
      </div>
    </StyledDialog>
  );
}
