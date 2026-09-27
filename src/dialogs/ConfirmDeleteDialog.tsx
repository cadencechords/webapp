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
      <div className="mb-6 text-body-medium text-on-surface-variant">
        {children ? children : 'Deleting this item is irreversible.'}
      </div>
      {/* M3 dialog actions, aligned to the end: the same buttons in the same
          order, with the destructive one in the error role. */}
      <div className="flex justify-end gap-2">
        <Button variant="open" color="blue" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="red" onClick={handleConfirm} loading={loading}>
          Yes, delete
        </Button>
      </div>
    </StyledDialog>
  );
}
