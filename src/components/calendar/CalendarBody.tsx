import CalendarRow from './CalendarRow';
import type { CalendarDate } from '../../utils/date';
import type { CalendarEvent } from '../../types';

type CalendarBodyProps = {
  /** Six weeks from `getCalendarDates`; unset until they're worked out. */
  weeks?: (CalendarDate | null)[][];
  /** The month's events. */
  events?: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
};

export default function CalendarBody({
  weeks,
  events,
  onEventClick,
}: CalendarBodyProps) {
  if (weeks) {
    return (
      <div className="border dark:border-dark-gray-600 rounded-md text-center">
        <CalendarRow
          days={weeks[0]}
          className="border-b dark:border-dark-gray-600"
          events={events}
          onEventClick={onEventClick}
        />
        <CalendarRow
          days={weeks[1]}
          className="border-b dark:border-dark-gray-600"
          events={events}
          onEventClick={onEventClick}
        />
        <CalendarRow
          days={weeks[2]}
          className="border-b dark:border-dark-gray-600"
          events={events}
          onEventClick={onEventClick}
        />
        <CalendarRow
          days={weeks[3]}
          className="border-b dark:border-dark-gray-600"
          events={events}
          onEventClick={onEventClick}
        />
        {weeks[4][0] && (
          <CalendarRow
            days={weeks[4]}
            events={events}
            onEventClick={onEventClick}
          />
        )}
        {weeks[5][0] && (
          <CalendarRow
            days={weeks[5]}
            className="border-t dark:border-dark-gray-600"
            events={events}
            onEventClick={onEventClick}
          />
        )}
      </div>
    );
  } else {
    return null;
  }
}
