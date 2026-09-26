import { useMutation, useQueryClient } from '@tanstack/react-query';
import EventsApi, { type EventRequest } from '../../api/eventsApi';
import { reportError } from '../../utils/error';
import type { CalendarEvent } from '../../types';

export default function useCreateCalendarEvent({
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
  } = useMutation<CalendarEvent, Error, EventRequest>({
    mutationFn: async event => {
      const { data } = await EventsApi.create(event);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      onSuccess?.();
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
