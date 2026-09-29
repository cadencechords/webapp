import EventFormPage from '../components/EventFormPage';
import useEventForm from '../hooks/forms/useEventForm';
import useCreateCalendarEvent from '../hooks/api/useCreateCalendarEvent';
import { useHistory } from 'react-router-dom';
import useClearForm from '../hooks/useClearForm';
import { fromEventForm } from '../utils/event.utils';

export default function CreateCalendarEventPage() {
  const router = useHistory();
  const { isValid, form, clearForm } = useEventForm();
  const {
    isLoading: isCreating,
    run: createEvent,
    isError,
  } = useCreateCalendarEvent({ onSuccess: () => router.replace('/calendar') });

  useClearForm(clearForm);

  function handleSave() {
    const event = fromEventForm(form);
    createEvent(event);
  }

  return (
    <EventFormPage
      title="New event"
      canSave={isValid}
      saving={isCreating}
      saveFailed={isError}
      onSave={handleSave}
    />
  );
}
