import { useQuery } from '@tanstack/react-query';
import EventsApi from '../../api/eventsApi';
import type { CalendarEvent, Id } from '../../types';

export default function useCalendarEvent(
  id: Id,
  {
    enabled = true,
    onSuccess,
  }: { enabled?: boolean; onSuccess?: (event: CalendarEvent) => void } = {}
) {
  const {
    // Reading a field of the `[]` placeholder gives `undefined`, as a
    // `Partial<CalendarEvent>` does.
    data = [] as Partial<CalendarEvent>,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery<CalendarEvent, Error>({
    queryKey: ['events', id],
    queryFn: async () => {
      return (await EventsApi.get(id)).data;
    },
    enabled,
    onSuccess,
  });

  return { data, isLoading: isLoading && enabled, isError, isSuccess, error };
}
