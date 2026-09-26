import { useQuery } from '@tanstack/react-query';
import SetlistApi from '../../api/SetlistApi';
import type { Setlist } from '../../types';

export default function useSetlists() {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery<Setlist[], Error>({
    queryKey: ['setlists'],
    queryFn: async () => {
      return (await SetlistApi.getAll()).data;
    },
  });

  return { data, isLoading, isError, isSuccess, error };
}
