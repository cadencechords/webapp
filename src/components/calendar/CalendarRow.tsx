import CalendarCell from './CalendarCell';
import type { CalendarDay } from './CalendarCell';
import { isSameDay } from '../../utils/date';
import type { CalendarEvent } from '../../types';

type CalendarRowProps = {
  /** Seven days; the padding days before the 1st and after the last are empty. */
  days: (CalendarDay | null)[];
  events?: CalendarEvent[];
  className?: string;
  onEventClick?: (event: CalendarEvent) => void;
};

// A week: seven cells, 1px apart so the grid's outline-variant shows through
// as the lines between them.
export default function CalendarRow({
  days,
  events,
  className = '',
  onEventClick,
}: CalendarRowProps) {
  function findEventsForDay(day: CalendarDay | null) {
    if (day && events) {
      return events.filter(event => isSameDay(event.start_time, day.fullDate));
    } else {
      return [];
    }
  }

  return (
    <div className={`grid grid-cols-7 gap-px ${className}`}>
      {days.map((day, index) => (
        <CalendarCell
          key={index}
          date={day}
          events={findEventsForDay(day)}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  );
}
