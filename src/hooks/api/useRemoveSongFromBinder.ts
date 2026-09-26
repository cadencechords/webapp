import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import BinderApi from '../../api/BinderApi';
import type { Binder, Id } from '../../types';

export default function useRemoveSongFromBinder({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<void, Error, { binderId: Id; songId: Id }>({
    mutationFn: async ({ binderId, songId }) => {
      await BinderApi.removeSongs(binderId, [songId]);
    },
    onSuccess: (_, variables) => {
      const { binderId, songId } = variables;
      const binderKey = ['binders', `${binderId}`];
      const binder = queryClient.getQueryData<Binder>(binderKey);
      const updatedBinder = {
        ...binder,
        songs: binder.songs.filter(song => song.id !== songId),
      };
      queryClient.setQueryData<Binder>(binderKey, updatedBinder);

      queryClient.invalidateQueries(binderKey);
      onSuccess?.();
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
