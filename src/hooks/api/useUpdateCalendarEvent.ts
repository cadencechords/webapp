import { useMutation, useQueryClient } from '@tanstack/react-query';
import EventsApi, { type EventRequest } from '../../api/eventsApi';
import { reportError } from '../../utils/error';
import type { CalendarEvent, Id } from '../../types';

export default function useUpdateCalendarEvent({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<CalendarEvent, Error, { updates: EventRequest; id: Id }>({
    mutationFn: async ({ updates, id }) => {
      const { data } = await EventsApi.update(updates, id);
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(['events', id]);
      onSuccess?.();
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
