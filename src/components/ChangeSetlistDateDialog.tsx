import { useState } from 'react';

import AddCancelActions from './buttons/AddCancelActions';
import OutlinedInput from './inputs/OutlinedInput';
import SetlistApi from '../api/SetlistApi';
import StyledDialog from './StyledDialog';
import { reportError } from '../utils/error';
import { useParams } from 'react-router';
import { format } from '../utils/DateUtils';

type ChangeSetlistDateDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
  scheduledDate?: string;
  onDateChanged: (scheduledDate: string | undefined) => void;
};

export default function ChangeSetlistDateDialog({
  open,
  onCloseDialog,
  scheduledDate,
  onDateChanged,
}: ChangeSetlistDateDialogProps) {
  return (
    <StyledDialog
      open={open}
      onCloseDialog={onCloseDialog}
      title="Change scheduled date"
    >
      {/* StyledDialog unmounts its contents while closed, so each opening
          starts from the current date. */}
      <ChangeSetlistDateForm
        onCloseDialog={onCloseDialog}
        scheduledDate={scheduledDate}
        onDateChanged={onDateChanged}
      />
    </StyledDialog>
  );
}

function ChangeSetlistDateForm({
  onCloseDialog,
  scheduledDate,
  onDateChanged,
}: Omit<ChangeSetlistDateDialogProps, 'open'>) {
  const [editingScheduledDate, setEditingScheduledDate] =
    useState(scheduledDate);
  const [dateValid, setDateValid] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { id } = useParams<{ id: string }>();

  const handleDateChange = (newDate: string) => {
    const dateToValidate = new Date(newDate);
    setDateValid(!isNaN(dateToValidate.getTime()));
    setEditingScheduledDate(newDate);
  };

  const handleUpdateDate = async () => {
    setUpdating(true);
    try {
      await SetlistApi.updateOne({ scheduledDate: editingScheduledDate }, id);
      onDateChanged(editingScheduledDate);
      onCloseDialog();
    } catch (error) {
      reportError(error);
      setUpdating(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <OutlinedInput
          type="date"
          onChange={handleDateChange}
          value={
            editingScheduledDate
              ? format('YYYY-MM-DD', editingScheduledDate)
              : ''
          }
          label="Scheduled date"
          className="h-10"
          id="date-picker"
        />
      </div>
      <AddCancelActions
        addDisabled={!dateValid}
        addText="Update date"
        onCancel={onCloseDialog}
        onAdd={handleUpdateDate}
        loadingAdd={updating}
      />
    </>
  );
}
