import CalendarDateButton from '../buttons/CalendarDateButton';
import CalendarEventEntry from './CalendarEventEntry';

/** A day in the calendar grid, from `utils/date`. */
type CalendarDay = {
  fullDate: Date;
  dateNumber: number;
  isToday: boolean;
};

type CalendarEvent = {
  id: number;
  color?: string;
};

type CalendarCellProps<E extends CalendarEvent> = {
  /** Empty for the padding cells before the 1st and after the last day. */
  date?: CalendarDay | null;
  className?: string;
  events?: E[];
  onEventClick?: (event: E) => void;
};

export default function CalendarCell<E extends CalendarEvent>({
  date,
  className = '',
  events,
  onEventClick,
}: CalendarCellProps<E>) {
  if (date) {
    return (
      <div className={`col-span-1 h-28 w-full p-1 ${className}`}>
        <CalendarDateButton selected={date.isToday} className="mb-2">
          {date.dateNumber}
        </CalendarDateButton>
        {events?.map(event => (
          <CalendarEventEntry
            key={event.id}
            event={event}
            onClick={onEventClick}
          />
        ))}
      </div>
    );
  } else {
    return <div className={`col-span-1 h-28 w-full py-1 ${className}`}></div>;
  }
}
