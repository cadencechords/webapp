import { useMutation, useQueryClient } from '@tanstack/react-query';
import EventsApi from '../../api/eventsApi';
import { reportError } from '../../utils/error';

export default function useUpdateCalendarEvent({ onSuccess }) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
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
