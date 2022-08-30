import { useQuery } from '@tanstack/react-query';
import SongApi from '../api/SongApi';

export default function useSongs() {
  const {
    data = [],
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery(['songs'], SongApi.getAll);
  return { data, isLoading, isError, error, isSuccess };
}
