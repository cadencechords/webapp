import { useQuery } from '@tanstack/react-query';
import SetlistApi from '../../api/SetlistApi';

export default function useSetlist(id, { enabled = true } = {}) {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['setlists', `${id}`],
    queryFn: async () => {
      return (await SetlistApi.getOne(id)).data;
    },
    enabled,
  });

  return { data, isLoading, isError, isSuccess, error };
}
