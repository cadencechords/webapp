import { useMutation, useQueryClient } from '@tanstack/react-query';
import EventsApi from '../../api/eventsApi';
import { reportError } from '../../utils/error';

export default function useCreateCalendarEvent({ onSuccess }) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
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
