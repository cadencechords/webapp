import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import BinderApi, { type BinderUpdates } from '../../api/BinderApi';
import type { Binder, Id } from '../../types';

export default function useUpdateBinder({
  onSuccess,
}: {
  onSuccess?: (binder: Binder) => void;
}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<Binder, Error, { id: Id; updates: BinderUpdates }>({
    mutationFn: async ({ id, updates }) => {
      const { data } = await BinderApi.updateOneById(id, updates);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['binders', variables.id]);
      onSuccess?.(data);
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
