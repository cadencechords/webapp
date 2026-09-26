import dayjs from 'dayjs';
import { createContext, useContext, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React from 'react';
import { toEventForm } from '../utils/event.utils';
import type { CalendarEvent, EventForm } from '../types';

export interface EventFormContextValue {
  form: EventForm;
  /** Whether the form has a title and a valid start date and time. */
  isValid: boolean;
  /** Fills the form from a saved event. */
  populateForm: (event: CalendarEvent) => void;
  setForm: Dispatch<SetStateAction<EventForm>>;
}

export const EventFormContext = createContext<
  EventFormContextValue | undefined
>(undefined);

/** The event form context. Throws outside an `EventFormProvider`. */
export function useEventFormContext(): EventFormContextValue {
  const value = useContext(EventFormContext);
  if (value === undefined) {
    throw new Error(
      'useEventFormContext must be used inside an EventFormProvider'
    );
  }
  return value;
}

export default function EventFormProvider(props: { children?: ReactNode }) {
  const [form, setForm] = useState<EventForm>({
    title: '',
    description: '',
    color: 'blue',
    memberships: [],
    remind_number_of_hours_before: 1,
  });

  function checkIfValid() {
    const { startDate, startTime, title } = form;
    if (!title || !startDate) return false;

    if (!startTime) return dayjs(startDate).isValid();

    return dayjs(`${startDate} ${startTime}`, 'YYYY-MM-DD h:mm A').isValid();
  }

  function populateForm(event: CalendarEvent) {
    const _form = toEventForm(event);
    setForm(_form);
  }

  return (
    <EventFormContext.Provider
      {...props}
      value={{ form, isValid: checkIfValid(), populateForm, setForm }}
    />
  );
}
