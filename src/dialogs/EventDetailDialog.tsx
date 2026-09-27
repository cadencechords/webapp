import { format, getTimeFromDate } from '../utils/date';

import EventColorOption from '../components/EventColorOption';
import EventDetailSheet from '../components/EventDetailSheet';
import StyledDialog from '../components/StyledDialog';
import type { CalendarEvent } from '../types';

type EventDetailDialogProps = {
  open: boolean;
  event?: CalendarEvent | null;
  onCloseDialog: () => void;
  onDeleted: (eventId: number) => void;
  /** Not read. */
  onUpdated?: (updatedEvent: CalendarEvent) => void;
};

export default function EventDetailDialog({
  open,
  event,
  onCloseDialog,
  onDeleted,
}: EventDetailDialogProps) {
  const startTime = getTimeFromDate(event?.start_time);
  const endTime = getTimeFromDate(event?.end_time);

  function constructTitle() {
    return (
      <div className="grid grid-cols-10 gap-6">
        <div className="flex items-center justify-end col-span-1">
          <EventColorOption className="shrink-0" color={event?.color} />
        </div>
        <div className="col-span-9">
          <div className="mb-1 text-2xl">{event?.title}</div>
          <div className="text-on-surface-variant">
            {format(event?.start_time, 'MMMM D, YYYY')}&nbsp;
            {startTime && '(' + startTime}
            {startTime && endTime && '-'}
            {!startTime && endTime && 'ends at '}
            {endTime}
            {startTime && ')'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <StyledDialog
      open={open}
      onCloseDialog={onCloseDialog}
      title={constructTitle()}
      borderedTop={false}
      size="2xl"
      fullscreen={false}
    >
      <EventDetailSheet
        event={event}
        onDeleted={onDeleted}
        onCloseDialog={onCloseDialog}
      />
    </StyledDialog>
  );
}
