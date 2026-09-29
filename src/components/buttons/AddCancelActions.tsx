import type { MouseEventHandler, ReactNode } from 'react';
import Button from '../Button';
import DialogActions from '../DialogActions';

type AddCancelActionsProps = {
  onAdd?: MouseEventHandler<HTMLButtonElement>;
  onCancel?: MouseEventHandler<HTMLButtonElement>;
  loadingAdd?: boolean;
  addDisabled?: boolean;
  addText?: ReactNode;
};

// A dialog's Cancel and Add: M3 text buttons in DialogActions, Cancel
// neutral.
export default function AddCancelActions({
  onAdd,
  onCancel,
  loadingAdd,
  addDisabled,
  addText = 'Add',
}: AddCancelActionsProps) {
  return (
    <DialogActions
      onCancel={onCancel}
      primary={
        <Button
          variant="open"
          size="sm"
          onClick={onAdd}
          loading={loadingAdd}
          disabled={addDisabled}
        >
          {addText}
        </Button>
      }
    />
  );
}
