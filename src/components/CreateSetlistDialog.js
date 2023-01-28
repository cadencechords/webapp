import { useEffect, useRef, useState } from 'react';

import AddCancelActions from './buttons/AddCancelActions';
import OutlinedInput from './inputs/OutlinedInput';
import StyledDialog from './StyledDialog';
import useCreateSetlist from '../hooks/api/useCreateSetlist';
import { useHistory } from 'react-router-dom';

export default function CreateSetlistDialog({ open, onCloseDialog }) {
  const [name, setName] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const router = useHistory();

  const { isLoading: isCreating, run: createSetlist } = useCreateSetlist({
    onSuccess: createdSetlist => {
      handleCloseDialog();
      router.push(`/sets/${createdSetlist.id}`, createdSetlist);
    },
  });

  const inputRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      if (open) {
        inputRef.current?.focus();
      }
    }, 100);
  }, [open]);

  const isDateValid = () => {
    let dateToValidate = new Date(scheduledDate);
    return !isNaN(dateToValidate);
  };

  const canCreate = name && isDateValid();

  function handleCreateSetlist() {
    createSetlist({
      name,
      scheduledDate: new Date(scheduledDate).toISOString(),
    });
  }

  function clearFields() {
    setName('');
    setScheduledDate('');
  }

  function handleCloseDialog() {
    clearFields();
    onCloseDialog();
  }

  return (
    <StyledDialog
      title="Create a set"
      open={open}
      onCloseDialog={handleCloseDialog}
    >
      <div className="mb-4">
        <OutlinedInput
          label="Name"
          placeholder="Give your set a name"
          value={name}
          onChange={setName}
          ref={inputRef}
        />
      </div>

      <div className="mb-4">
        <OutlinedInput
          type="date"
          onChange={setScheduledDate}
          value={scheduledDate}
          label="Scheduled date"
          className="h-10"
          id="date-picker"
        />
      </div>
      <AddCancelActions
        onCancel={handleCloseDialog}
        addText="Create"
        addDisabled={!canCreate}
        onAdd={handleCreateSetlist}
        loadingAdd={isCreating}
      />
    </StyledDialog>
  );
}
