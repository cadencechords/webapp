import { useMutation, useQueryClient } from '@tanstack/react-query';
import BinderApi from '../../api/BinderApi';
import { reportError } from '../../utils/error';
import type { Id } from '../../types';

export default function useDeleteBinder({
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
    // The delete isn't awaited, as before: React Query resolves a plain
    // `undefined` return and this `async` function's promise the same way.
    mutationFn: async id => {
      BinderApi.deleteOneById(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['binders']);
      onSuccess?.();
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
