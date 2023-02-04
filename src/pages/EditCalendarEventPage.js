import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import EventForm from '../components/EventForm';
import Button from '../components/Button';
import useEventForm from '../hooks/forms/useEventForm';
import { Link, useHistory, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
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
import ArrowNarrowLeftIcon from '@heroicons/react/outline/ArrowNarrowLeftIcon';

export default function EditCalendarEventPage() {
  const { form, setForm, clearForm, isValid } = useEventForm();
  const [originalValue, setOriginalValue] = useState(form);
  const { id } = useParams();
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
    <div className="container max-w-3xl">
      <Link to="/calendar" className="inline-block mb-4">
        <Button variant="open" color="gray">
          <div className="flex-center">
            <ArrowNarrowLeftIcon className="w-4 h-4 mr-4" />
            Calendar
          </div>
        </Button>
      </Link>
      {isError && (
        <div className="hidden mb-4 lg:block">
          <Alert color="red">An error occurred. Please try again later</Alert>
        </div>
      )}
      <div className="flex-between">
        <PageTitle title="Edit Event" />
        <Button
          className="hidden w-32 lg:block"
          disabled={!isValid}
          onClick={handleSave}
          loading={isSaving}
        >
          Save event
        </Button>
      </div>
      <EventForm />
      <Button
        className="w-full lg:hidden"
        disabled={!isValid}
        onClick={handleSave}
        loading={isSaving}
      >
        Save event
      </Button>
      {isError && (
        <div className="mt-6 lg:hidden">
          <Alert color="red">An error occurred. Please try again later.</Alert>
        </div>
      )}
    </div>
  );
}
