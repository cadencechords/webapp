import Button from '../components/Button';
import DialogActions from '../components/DialogActions';
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
      size="sm"
      showClose={false}
    >
      <div className="text-body-medium text-on-surface-variant">
        {children ? children : 'Deleting this item is irreversible.'}
      </div>
      {/* A basic dialog: no close button, Cancel and the destructive action in
          the error role. */}
      <DialogActions>
        <Button variant="open" color="gray" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="red" size="sm" onClick={handleConfirm} loading={loading}>
          Yes, delete
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
