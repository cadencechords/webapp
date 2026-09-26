import {
  MONTHS,
  getCalendarDates,
  getMonthYearFromDate,
} from '../../utils/date';
import { useEffect, useState } from 'react';

import CalendarBody from './CalendarBody';
import CalendarHeader from './CalendarHeader';
import EventDetailDialog from '../../dialogs/EventDetailDialog';
import dayjs from 'dayjs';
import type { CalendarEvent } from '../../types';

type CalendarProps = {
  events?: CalendarEvent[];
  canCreateEvents?: boolean;
  /** Not read. */
  onEventCreated?: (createdEvent: CalendarEvent) => void;
  onEventDeleted: (eventId: number) => void;
  onEventUpdated: (updatedEvent: CalendarEvent) => void;
};

export default function Calendar({
  events,
  canCreateEvents,
  onEventDeleted,
  onEventUpdated,
}: CalendarProps) {
  const [month, setMonth] = useState(dayjs().month());
  const [year, setYear] = useState(dayjs().year());
  const [calendarWeeks, setCalendarWeeks] =
    useState<ReturnType<typeof getCalendarDates>>();
  const [eventToShow, setEventToShow] = useState<CalendarEvent | null>();
  /** Keyed by `getMonthYearFromDate`, e.g. `'0 2024'`. */
  const [eventsByMonth, setEventsByMonth] = useState<
    Record<string, CalendarEvent[]>
  >({});

  useEffect(() => {
    setCalendarWeeks(getCalendarDates(month, year));
  }, [month, year]);

  useEffect(() => {
    if (events) {
      const updatedEventsByMonth: Record<string, CalendarEvent[]> = {};
      events.forEach(event => {
        const monthYearKey = getMonthYearFromDate(event.start_time);
        updatedEventsByMonth[monthYearKey] =
          updatedEventsByMonth[monthYearKey] || [];
        updatedEventsByMonth[monthYearKey].push(event);
      });
      setEventsByMonth(updatedEventsByMonth);
    }
  }, [events]);

  const handleChangeMonth = (directionToChange: number) => {
    const newMonth = dayjs()
      .set('month', month)
      .set('year', year)
      .set('date', 2)
      .add(directionToChange, 'month');

    setMonth(newMonth.get('month'));
    setYear(newMonth.get('year'));
  };

  const handleEventUpdated = (updatedEvent: CalendarEvent) => {
    setEventToShow(updatedEvent);
    onEventUpdated(updatedEvent);
  };

  return (
    <div>
      <CalendarHeader
        title={`${MONTHS[month]} ${year}`}
        onNextMonth={() => handleChangeMonth(1)}
        onPreviousMonth={() => handleChangeMonth(-1)}
        canCreate={canCreateEvents}
      />
      <CalendarBody
        weeks={calendarWeeks}
        events={eventsByMonth[`${month} ${year}`]}
        onEventClick={setEventToShow}
      />
      <EventDetailDialog
        open={Boolean(eventToShow)}
        event={eventToShow}
        onCloseDialog={() => setEventToShow(null)}
        onDeleted={onEventDeleted}
        onUpdated={handleEventUpdated}
      />
    </div>
  );
}
