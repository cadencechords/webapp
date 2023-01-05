import dayjs from 'dayjs';
import { createContext, useState } from 'react';
import React from 'react';

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
  return (
    <EventFormContext.Provider
      {...props}
      value={{ form, setForm, isValid: checkIfValid() }}
    />
  );
}
