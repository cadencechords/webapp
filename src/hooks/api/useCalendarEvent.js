import { useQuery } from '@tanstack/react-query';
import EventsApi from '../../api/eventsApi';

export default function useCalendarEvent(
  id,
  { enabled = true, onSuccess } = {}
) {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      return (await EventsApi.get(id)).data;
    },
    enabled,
    onSuccess,
  });

  return { data, isLoading: isLoading && enabled, isError, isSuccess, error };
}
