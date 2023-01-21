import { useMutation, useQueryClient } from '@tanstack/react-query';
import SongApi from '../../api/SongApi';
import { reportError } from '../../utils/error';

export default function useDeleteSong({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
    mutationFn: async id => {
      const { data } = await SongApi.deleteOneById(id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['songs']);
      onSuccess?.();
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
