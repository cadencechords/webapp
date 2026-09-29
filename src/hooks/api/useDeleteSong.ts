import { useMutation, useQueryClient } from '@tanstack/react-query';
import SongApi from '../../api/SongApi';
import { reportError } from '../../utils/error';
import { getTeamId } from '../../utils/AuthUtils';
import { removeRecentlyViewed } from '../../utils/recentlyViewed';
import type { Id } from '../../types';

export default function useDeleteSong({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<unknown, Error, Id>({
    mutationFn: async id => {
      const { data } = await SongApi.deleteOneById(id);
      return data;
    },
    onSuccess: (_data, id) => {
      removeRecentlyViewed(getTeamId(), 'song', id);
      queryClient.invalidateQueries(['songs']);
      onSuccess?.();
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
