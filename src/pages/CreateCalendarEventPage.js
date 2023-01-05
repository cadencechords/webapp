import React from 'react';
import PageTitle from '../components/PageTitle';
import EventForm from '../components/EventForm';
import Button from '../components/Button';
import useEventForm from '../hooks/forms/useEventForm';
import useCreateCalendarEvent from '../hooks/api/useCreateCalendarEvent';
import { useHistory } from 'react-router-dom';
import Alert from '../components/Alert';
import dayjs from 'dayjs';
import { subtractHours } from '../utils/date';
import useClearForm from '../hooks/useClearForm';

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
    let event = {
      title: form.title,
      description: form.description,
      color: form.color,
      reminders_enabled: !!form.reminders_enabled,
    };

    if (form.setlist) {
      event.setlist_id = form.setlist.id;
    }

    if (form.startTime) {
      event.start_time = dayjs(
        `${form.startDate} ${form.startTime}`,
        'YYYY-MM-DD h:mm A'
      ).toDate();
    } else {
      event.start_time = dayjs(form.startDate).toDate();
    }

    if (form.endTime) {
      event.end_time = dayjs(
        `${form.startDate} ${form.endTime}`,
        'YYYY-MM-DD h:mm A'
      ).toDate();
    }

    if (form.reminders_enabled) {
      if (form.memberships?.length) {
        event.membership_ids = form.memberships.map(
          membership => membership.id
        );
      }

      if (form.remind_number_of_hours_before) {
        event.reminder_date = subtractHours(
          form.remind_number_of_hours_before,
          event.start_time
        ).toDate();
      }
    }

    createEvent(event);
  }

  return (
    <div className="container max-w-3xl">
      {isError && (
        <div className="hidden mb-4 lg:block">
          <Alert color="red">An error occurred. Please try again later</Alert>
        </div>
      )}
      <div className="flex-between">
        <PageTitle title="New Event" />
        <Button
          className="hidden w-16 lg:block"
          disabled={!isValid}
          onClick={handleSave}
          loading={isCreating}
        >
          Save
        </Button>
      </div>
      <EventForm />
      <Button
        className="w-full lg:hidden"
        disabled={!isValid}
        onClick={handleSave}
        loading={isCreating}
      >
        Save
      </Button>
      {isError && (
        <div className="mt-6 lg:hidden">
          <Alert color="red">An error occurred. Please try again later.</Alert>
        </div>
      )}
    </div>
  );
}
