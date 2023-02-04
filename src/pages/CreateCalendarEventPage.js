import React from 'react';
import PageTitle from '../components/PageTitle';
import EventForm from '../components/EventForm';
import Button from '../components/Button';
import useEventForm from '../hooks/forms/useEventForm';
import useCreateCalendarEvent from '../hooks/api/useCreateCalendarEvent';
import { Link, useHistory } from 'react-router-dom';
import Alert from '../components/Alert';
import useClearForm from '../hooks/useClearForm';
import { fromEventForm } from '../utils/event.utils';
import ArrowNarrowLeftIcon from '@heroicons/react/outline/ArrowNarrowLeftIcon';

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
        <PageTitle title="New Event" />
        <Button
          className="hidden w-32 lg:block"
          disabled={!isValid}
          onClick={handleSave}
          loading={isCreating}
        >
          Save event
        </Button>
      </div>
      <EventForm />
      <Button
        className="w-full lg:hidden"
        disabled={!isValid}
        onClick={handleSave}
        loading={isCreating}
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
