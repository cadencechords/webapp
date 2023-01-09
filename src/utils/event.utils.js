import dayjs from 'dayjs';
import { diffInHours, subtractHours } from './date';
import _ from 'lodash';

export function toEventForm(event) {
  const form = {
    ...event,
    title: event.title || '',
    description: event.description || '',
    color: event.color || 'blue',
    memberships: event.memberships || [],
    reminders_enabled: !!event.reminders_enabled,
    reminder_date: event.reminder_date,
    remind_number_of_hours_before:
      event.reminders_enabled && event.reminder_date
        ? diffInHours(event.start_time, event.reminder_date)
        : 1,
    startDate: event.start_time
      ? dayjs(event.start_time).format('YYYY-MM-DD')
      : '',
    startTime:
      event.start_time &&
      !dayjs(event.start_time).startOf('day').isSame(dayjs(event.start_time))
        ? dayjs(event.start_time).format('h:mm A')
        : '',
    endTime: event.end_time ? dayjs(event.end_time).format('h:mm A') : '',
  };

  return form;
}

export function fromEventForm(form) {
  let event = {
    title: form.title,
    description: form.description,
    color: form.color,
    reminders_enabled: !!form.reminders_enabled,
  };

  event.setlist_id = !form.setlist ? null : form.setlist.id;

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
      event.membership_ids = form.memberships.map(membership => membership.id);
    }

    if (form.remind_number_of_hours_before) {
      event.reminder_date = subtractHours(
        form.remind_number_of_hours_before,
        event.start_time
      ).toDate();
    }
  }

  return event;
}

export function hasDifferentMembers(listOne, listTwo) {
  const setOne = new Set(listOne);
  const setTwo = new Set(listTwo);

  return !_.isEqual(setOne, setTwo);
}

export function hasDifferentSetlist(setlistA, setlistB) {
  if (!setlistA && !setlistB) {
    return false;
  }

  if (!setlistA || !setlistB) {
    return true;
  }

  return parseInt(setlistA.id) !== parseInt(setlistB.id);
}

export function hasDifferentTimes(timeA, timeB) {
  if (timeA && !timeB) {
    return true;
  }

  if (timeB && !timeA) {
    return true;
  }

  if (!timeB && !timeA) {
    return false;
  }

  const dayA = dayjs(timeA).startOf('minute');
  const dayB = dayjs(timeB).startOf('minute');
  return !dayA.isSame(dayB);
}

export function hasDifferentReminderTimes(timeA, timeB) {
  if (timeA && !timeB) {
    return true;
  }

  if (timeB && !timeA) {
    return true;
  }

  if (!timeB && !timeA) {
    return false;
  }

  const dayA = dayjs(timeA).startOf('hour');
  const dayB = dayjs(timeB).startOf('hour');
  return !dayA.isSame(dayB);
}
