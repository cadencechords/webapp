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

export default function Calendar({
  events,
  canCreateEvents,
  onEventDeleted,
  onEventUpdated,
}) {
  const [month, setMonth] = useState(dayjs().month());
  const [year, setYear] = useState(dayjs().year());
  const [calendarWeeks, setCalendarWeeks] = useState();
  const [eventToShow, setEventToShow] = useState();
  const [eventsByMonth, setEventsByMonth] = useState({});

  useEffect(() => {
    setCalendarWeeks(getCalendarDates(month, year));
  }, [month, year]);

  useEffect(() => {
    if (events) {
      let updatedEventsByMonth = {};
      events.forEach(event => {
        let monthYearKey = getMonthYearFromDate(event.start_time);
        updatedEventsByMonth[monthYearKey] =
          updatedEventsByMonth[monthYearKey] || [];
        updatedEventsByMonth[monthYearKey].push(event);
      });
      setEventsByMonth(updatedEventsByMonth);
    }
  }, [events]);

  const handleChangeMonth = directionToChange => {
    let newMonth = dayjs()
      .set('month', month)
      .set('year', year)
      .set('date', 2)
      .add(directionToChange, 'month');

    setMonth(newMonth.get('month'));
    setYear(newMonth.get('year'));
  };

  const handleEventUpdated = updatedEvent => {
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
