import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import SetlistApi, { type NewSetlist } from '../../api/SetlistApi';
import type { Setlist } from '../../types';

export default function useCreateSetlist({
  onSuccess,
}: {
  onSuccess?: (setlist: Setlist) => void;
}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<Setlist, Error, NewSetlist>({
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
