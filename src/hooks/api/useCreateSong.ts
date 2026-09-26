import { useMutation, useQueryClient } from '@tanstack/react-query';
import SongApi from '../../api/SongApi';
import { reportError } from '../../utils/error';
import type { Song } from '../../types';

export default function useCreateSong({
  onSuccess,
}: {
  onSuccess?: (song: Song) => void;
}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<Song, Error, { name: string }>({
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
