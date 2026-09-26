import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import SongApi, { type SongUpdates } from '../../api/SongApi';
import type { Id, Song } from '../../types';

export default function useUpdateSong({
  onSuccess,
}: { onSuccess?: (song: Song) => void } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<Song, Error, { id: Id; updates: SongUpdates }>({
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
