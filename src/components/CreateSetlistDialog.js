import { useEffect, useRef, useState } from 'react';

import AddCancelActions from './buttons/AddCancelActions';
import OutlinedInput from './inputs/OutlinedInput';
import StyledDialog from './StyledDialog';
import useCreateSetlist from '../hooks/api/useCreateSetlist';
import { useHistory } from 'react-router-dom';
import Checkbox from './Checkbox';
import { useSelector } from 'react-redux';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import { selectCurrentMember } from '../store/authSlice';
import { ADD_EVENTS } from '../utils/constants';
import dayjs from 'dayjs';

export default function CreateSetlistDialog({ open, onCloseDialog }) {
  const currentSubscription = useSelector(selectCurrentSubscription);
  const currentMember = useSelector(selectCurrentMember);
  const [name, setName] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [shouldAddToCalendar, setShouldAddToCalendar] = useState(true);

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
    const setlist = {
      name,
      scheduledDate: dayjs(scheduledDate).startOf('day').toDate(),
    };

    if (currentSubscription.isPro && currentMember.can(ADD_EVENTS)) {
      setlist.shouldAddToCalendar = shouldAddToCalendar;
    }

    createSetlist(setlist);
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

      {currentSubscription.isPro && currentMember.can(ADD_EVENTS) && (
        <div className="flex items-center pt-2 mb-6">
          <Checkbox
            checked={shouldAddToCalendar}
            id="add-to-calendar"
            onChange={setShouldAddToCalendar}
            className="mr-2"
          />
          <label className="select-none" htmlFor="add-to-calendar">
            Add as calendar event
          </label>
        </div>
      )}
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
