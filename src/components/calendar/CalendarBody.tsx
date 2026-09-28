import CalendarRow from './CalendarRow';
import type { CalendarDate } from '../../utils/date';
import type { CalendarEvent } from '../../types';

type CalendarBodyProps = {
  /** Six weeks from `getCalendarDates`. Without them, nothing renders. */
  weeks?: (CalendarDate | null)[][];
  /** The month's events. */
  events?: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
};

// The month as a grid with large corners: cells 1px apart on outline-variant,
// which shows through as the lines. The fifth and sixth weeks show only when
// the month reaches them.
export default function CalendarBody({
  weeks,
  events,
  onEventClick,
}: CalendarBodyProps) {
  if (!weeks) return null;

  const shownWeeks = weeks.filter((week, index) => index < 4 || week[0]);

  return (
    <div className="flex flex-col gap-px overflow-hidden border border-outline-variant rounded-large bg-outline-variant">
      {shownWeeks.map((week, index) => (
        <CalendarRow
          key={index}
          days={week}
          events={events}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  );
}
