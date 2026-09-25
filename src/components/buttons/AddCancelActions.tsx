import type { MouseEventHandler, ReactNode } from 'react';
import Button from '../Button';

type AddCancelActionsProps = {
  onAdd?: MouseEventHandler<HTMLButtonElement>;
  onCancel?: MouseEventHandler<HTMLButtonElement>;
  loadingAdd?: boolean;
  addDisabled?: boolean;
  addText?: ReactNode;
};

export default function AddCancelActions({
  onAdd,
  onCancel,
  loadingAdd,
  addDisabled,
  addText = 'Add',
}: AddCancelActionsProps) {
  return (
    <div className="flex-center gap-3">
      <Button
        className="grow w-1/2"
        variant="open"
        color="gray"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        className="grow w-1/2"
        onClick={onAdd}
        loading={loadingAdd}
        disabled={addDisabled}
      >
        {addText}
      </Button>
    </div>
  );
}
