import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import ColorsList from './ColorsList';
import OutlinedInput from './inputs/OutlinedInput';
import StyledDialog from './StyledDialog';
import { useHistory } from 'react-router';
import useCreateBinder from '../hooks/api/useCreateBinder';

export default function CreateBinderDialog({ open, onCloseDialog }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('none');
  const router = useHistory();
  const inputRef = useRef();

  const handleCloseDialog = () => {
    setName('');
    setDescription('');
    setColor('none');
    onCloseDialog();
  };

  const { run: createBinder, isLoading: isCreating } = useCreateBinder({
    onSuccess: createdBinder => {
      handleCloseDialog();
      router.push(`/binders/${createdBinder.id}`, createdBinder);
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
      title="Create a new binder"
      open={open}
      onCloseDialog={handleCloseDialog}
    >
      <div className="pt-2 mb-4">
        <div className="mb-2">Name</div>
        <OutlinedInput
          placeholder="ex: Hymns"
          onChange={setName}
          ref={inputRef}
        />
      </div>

      <div className="mb-4">
        <div className="mb-2">Description</div>
        <OutlinedInput
          placeholder="ex: Common hymns"
          onChange={setDescription}
        />
      </div>

      <div className="mb-6">
        <div className="mb-2">Color</div>
        <ColorsList onChange={setColor} color={color} />
      </div>

      <Button full loading={isCreating} onClick={handleCreateBinder}>
        Create
      </Button>
    </StyledDialog>
  );
}
