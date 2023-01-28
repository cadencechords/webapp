import { useMutation, useQueryClient } from '@tanstack/react-query';
import SetlistApi from '../../api/SetlistApi';
import { reportError } from '../../utils/error';

export default function useDeleteSetlist({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
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
