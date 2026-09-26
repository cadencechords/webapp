import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import BinderApi from '../../api/BinderApi';
import type { Binder, Id, Song } from '../../types';

export default function useAddSongsToBinder({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<Song[], Error, { binderId: Id; songIds: Id[] }>({
    mutationFn: async ({ binderId, songIds }) => {
      const { data } = await BinderApi.addSongs(binderId, songIds);
      return data;
    },
    onSuccess: (data, variables) => {
      const { binderId } = variables;
      const binderKey = ['binders', `${binderId}`];
      const binder = queryClient.getQueryData<Binder>(binderKey);
      const updatedBinder = {
        ...binder,
        songs: binder.songs.concat(data),
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
