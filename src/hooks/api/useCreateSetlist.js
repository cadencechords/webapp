import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import SetlistApi from '../../api/SetlistApi';

export default function useCreateSetlist({ onSuccess }) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
    mutationFn: async setlist => {
      const { data } = await SetlistApi.createOne(setlist);
      return data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries(['setlists']);
      onSuccess?.(data);
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
