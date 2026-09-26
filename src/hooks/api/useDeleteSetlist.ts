import { useMutation, useQueryClient } from '@tanstack/react-query';
import SetlistApi from '../../api/SetlistApi';
import { reportError } from '../../utils/error';
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
    onSuccess: () => {
      queryClient.invalidateQueries(['setlists']);
      onSuccess?.();
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
