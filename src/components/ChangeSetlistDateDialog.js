import { useEffect, useState } from "react";

import AddCancelActions from "./buttons/AddCancelActions";
import OutlinedInput from "./inputs/OutlinedInput";
import SetlistApi from "../api/SetlistApi";
import StyledDialog from "./StyledDialog";

import { useParams } from "react-router";

export default function ChangeSetlistDateDialog({
  open,
  onCloseDialog,
  scheduledDate,
  onDateChanged,
}) {
  const [editingScheduledDate, setEditingScheduledDate] =
    useState(scheduledDate);
  const [dateValid, setDateValid] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (open) {
      setEditingScheduledDate(scheduledDate);
    }
  }, [scheduledDate, open]);

  const handleDateChange = (newDate) => {
    let dateToValidate = new Date(newDate);
    setDateValid(!isNaN(dateToValidate));
    setEditingScheduledDate(newDate);
  };

  const clearFields = () => {
    setDateValid(false);
  };

  const handleCloseDialog = () => {
    clearFields();
    onCloseDialog();
  };

  const handleUpdateDate = async () => {
    SetlistApi.updateOne({ scheduledDate: editingScheduledDate }, id);
    onDateChanged(editingScheduledDate);
    handleCloseDialog();
  };

  return (
    <StyledDialog
      open={open}
      onCloseDialog={handleCloseDialog}
      title="Change scheduled date"
    >
      <div className="mb-4">
        <OutlinedInput
          type="date"
          onChange={handleDateChange}
          value={editingScheduledDate}
          label="Scheduled date"
          className="h-10"
        />
      </div>
      <AddCancelActions
        addDisabled={!dateValid}
        addText="Update date"
        onCancel={handleCloseDialog}
        onAdd={handleUpdateDate}
      />
    </StyledDialog>
  );
}
