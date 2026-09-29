import EventFormPage from '../components/EventFormPage';
import { useState } from 'react';
import useEventForm from '../hooks/forms/useEventForm';
import { useHistory, useParams } from 'react-router-dom';
import useClearForm from '../hooks/useClearForm';
import useCalendarEvent from '../hooks/api/useCalendarEvent';
import PageLoading from '../components/PageLoading';
import {
  fromEventForm,
  hasDifferentMembers,
  hasDifferentReminderTimes,
  hasDifferentTimes,
  toEventForm,
} from '../utils/event.utils';
import { getModifiedFields } from '../utils/ObjectUtils';
import useUpdateCalendarEvent from '../hooks/api/useUpdateCalendarEvent';

export default function EditCalendarEventPage() {
  const { form, setForm, clearForm, isValid } = useEventForm();
  const [originalValue, setOriginalValue] = useState(form);
  const { id } = useParams<{ id: string }>();
  const router = useHistory();

  const { isLoading } = useCalendarEvent(id, {
    enabled: !form.id,
    onSuccess: data => {
      setForm(data);
      setOriginalValue(toEventForm(data));
    },
  });

  const {
    isLoading: isSaving,
    run: updateEvent,
    isError,
  } = useUpdateCalendarEvent({ onSuccess: () => router.replace('/calendar') });

  useClearForm(clearForm);

  function handleSave() {
    const editedEvent = fromEventForm(form);
    const originalEvent = fromEventForm(originalValue);

    const modifiedFields = getModifiedFields(editedEvent, originalEvent, {
      membership_ids: hasDifferentMembers,
      start_time: hasDifferentTimes,
      end_time: hasDifferentTimes,
      reminder_date: hasDifferentReminderTimes,
    });

    updateEvent({ updates: modifiedFields, id });
  }

  if (isLoading) return <PageLoading />;

  return (
    <EventFormPage
      title="Edit event"
      canSave={isValid}
      saving={isSaving}
      saveFailed={isError}
      onSave={handleSave}
    />
  );
}
