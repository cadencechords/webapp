import { useQuery } from '@tanstack/react-query';
import SongApi from '../../api/SongApi';

export default function useSongs() {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['songs'],
    queryFn: async () => {
      return (await SongApi.getAll()).data;
    },
  });

  return { data, isLoading, isError, isSuccess, error };
}
