import classNames from 'classnames';
import { getTimeFromDate } from '../../utils/date';
import { userColorClasses } from '../../utils/userColors';
import type { CalendarEvent } from '../../types';

/** The fields of an event that an entry shows. */
export type CalendarEventEntryEvent = Pick<
  CalendarEvent,
  'color' | 'start_time' | 'title'
>;

type CalendarEventEntryProps<E extends CalendarEventEntryEvent> = {
  event: E;
  /** CalendarCell's onEventClick, which may be unset. */
  onClick?: (event: E) => void;
};

// An event in a calendar cell: a small-cornered chip in the event's color
// (a user color), or surface-container-highest without one. The time shows
// from sm up, where there's room.
export default function CalendarEventEntry<E extends CalendarEventEntryEvent>({
  event,
  onClick,
}: CalendarEventEntryProps<E>) {
  const { color, onColor } = userColorClasses(event.color);
  const time = getTimeFromDate(event.start_time);

  return (
    <button
      type="button"
      // Non-null: Calendar always passes onEventClick down through
      // CalendarBody, CalendarRow and CalendarCell. Without one a click
      // throws, as before.
      onClick={() => onClick!(event)}
      className={classNames(
        'block w-full px-1.5 py-0.5 rounded-small text-left truncate font-plain text-label-medium state-layer-flat focus-ring transition-colors',
        event.color
          ? `${color} ${onColor}`
          : 'bg-surface-container-highest text-on-surface'
      )}
    >
      {time && <span className="hidden sm:inline">{time} </span>}
      {event.title}
    </button>
  );
}
