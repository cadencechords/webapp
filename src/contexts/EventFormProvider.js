import dayjs from 'dayjs';
import { createContext, useState } from 'react';
import React from 'react';
import { toEventForm } from '../utils/event.utils';

export const EventFormContext = createContext();

export default function EventFormProvider(props) {
  const [form, setForm] = useState({
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

  function populateForm(event) {
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
