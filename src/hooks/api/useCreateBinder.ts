import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import BinderApi, { type NewBinder } from '../../api/BinderApi';
import type { Binder } from '../../types';

export default function useCreateBinder({
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
  } = useMutation<Binder, Error, NewBinder>({
    mutationFn: async binder => {
      const { data } = await BinderApi.createOne(binder);
      return data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries(['binders']);
      onSuccess?.(data);
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
