import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import BinderApi from '../../api/BinderApi';

export default function useRemoveSongFromBinder({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
    mutationFn: async ({ binderId, songId }) => {
      await BinderApi.removeSongs(binderId, [songId]);
    },
    onSuccess: (_, variables) => {
      const { binderId, songId } = variables;
      const binderKey = ['binders', `${binderId}`];
      const binder = queryClient.getQueryData(binderKey);
      const updatedBinder = {
        ...binder,
        songs: binder.songs.filter(song => song.id !== songId),
      };
      queryClient.setQueryData(binderKey, updatedBinder);

      queryClient.invalidateQueries(binderKey);
      onSuccess?.();
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
