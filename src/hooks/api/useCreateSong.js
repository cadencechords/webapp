import { useMutation, useQueryClient } from '@tanstack/react-query';
import SongApi from '../../api/SongApi';
import { reportError } from '../../utils/error';

export default function useCreateSong({ onSuccess }) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
    mutationFn: async song => {
      const { data } = await SongApi.createOne(song);
      return data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries(['songs']);
      onSuccess?.(data);
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
