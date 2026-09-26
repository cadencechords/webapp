import { useEffect, useState } from 'react';

import { BACKGROUND_COLORS } from '../Button';
import { getTimeFromDate } from '../../utils/date';
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

export default function CalendarEventEntry<E extends CalendarEventEntryEvent>({
  event,
  onClick,
}: CalendarEventEntryProps<E>) {
  const [colors, setColors] = useState(() =>
    event.color
      ? `${BACKGROUND_COLORS[event.color]} text-white transition-colors`
      : 'text-black'
  );

  useEffect(() => {
    if (event?.color) {
      setColors(
        `${BACKGROUND_COLORS[event.color]} text-white transition-colors`
      );
    }
  }, [event?.color]);

  return (
    <button
      // Non-null: Calendar always passes onEventClick down through
      // CalendarBody, CalendarRow and CalendarCell. Without one a click
      // throws, as before.
      onClick={() => onClick!(event)}
      className={`outline-hidden focus:outline-hidden rounded-md px-1 py-0.5 w-full ${colors} text-xs text-left truncate`}
    >
      {getTimeFromDate(event.start_time)} {event.title}
    </button>
  );
}
