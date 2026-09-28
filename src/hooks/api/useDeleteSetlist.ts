import { useMutation, useQueryClient } from '@tanstack/react-query';
import SetlistApi from '../../api/SetlistApi';
import { reportError } from '../../utils/error';
import { getTeamId } from '../../utils/AuthUtils';
import { removeRecentlyViewed } from '../../utils/recentlyViewed';
import type { Id } from '../../types';

export default function useDeleteSetlist({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<void, Error, Id>({
    mutationFn: async id => {
      await SetlistApi.deleteOne(id);
    },
    onSuccess: (_data, id) => {
      removeRecentlyViewed(getTeamId(), 'set', id);
      queryClient.invalidateQueries(['setlists']);
      onSuccess?.();
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
