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
      // addSongs returns undefined only for no songIds, and SearchSongsDialog
      // disables saving until a song is picked.
      const { data } = (await BinderApi.addSongs(binderId, songIds))!;
      return data;
    },
    onSuccess: (data, variables) => {
      const { binderId } = variables;
      const binderKey = ['binders', `${binderId}`];
      // Songs are added from the binder's page, which has loaded the binder
      // and its songs into this query.
      const binder = queryClient.getQueryData<Binder>(binderKey)!;
      const updatedBinder = {
        ...binder,
        songs: binder.songs!.concat(data),
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
