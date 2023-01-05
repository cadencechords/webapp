import { useQuery } from '@tanstack/react-query';
import SetlistApi from '../../api/SetlistApi';

export default function useSetlists() {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['setlists'],
    queryFn: async () => {
      return (await SetlistApi.getAll()).data;
    },
  });

  return { data, isLoading, isError, isSuccess, error };
}
