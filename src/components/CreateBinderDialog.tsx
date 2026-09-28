import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import DialogActions from './DialogActions';
import ColorSwatches from './ColorSwatches';
import OutlinedInput from './inputs/OutlinedInput';
import StyledDialog from './StyledDialog';
import { useHistory } from 'react-router';
import useCreateBinder from '../hooks/api/useCreateBinder';

type CreateBinderDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
};

export default function CreateBinderDialog({
  open,
  onCloseDialog,
}: CreateBinderDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('none');
  const router = useHistory();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCloseDialog = () => {
    setName('');
    setDescription('');
    setColor('none');
    onCloseDialog();
  };

  const { run: createBinder, isLoading: isCreating } = useCreateBinder({
    onSuccess: createdBinder => {
      handleCloseDialog();
      router.push(`/folders/${createdBinder.id}`, createdBinder);
    },
  });

  function handleCreateBinder() {
    createBinder({ name, description, color });
  }

  useEffect(() => {
    setTimeout(() => {
      if (open) {
        inputRef.current?.focus();
      }
    }, 100);
  }, [open]);

  return (
    <StyledDialog
      title="Create a new folder"
      open={open}
      onCloseDialog={handleCloseDialog}
    >
      {/* M3 outlined fields: the labels rest inside them and float into the
          outline on focus or once typed in. */}
      <div className="flex flex-col gap-4 pt-2 mb-6">
        <OutlinedInput label="Name" onChange={setName} ref={inputRef} />
        <OutlinedInput label="Description" onChange={setDescription} />
      </div>

      <div>
        <div className="mb-2 text-body-medium text-on-surface-variant">
          Color
        </div>
        <ColorSwatches onChange={setColor} color={color} />
      </div>

      <DialogActions>
        <Button
          variant="open"
          color="gray"
          size="sm"
          onClick={handleCloseDialog}
        >
          Cancel
        </Button>
        <Button
          variant="open"
          size="sm"
          loading={isCreating}
          onClick={handleCreateBinder}
        >
          Create
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
