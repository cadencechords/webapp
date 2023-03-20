import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import SongApi from '../../api/SongApi';

export default function useUpdateSong({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data } = await SongApi.updateOneById(id, updates);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['songs', variables.id]);
      onSuccess?.(data);
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
