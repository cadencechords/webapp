import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import BinderApi from '../../api/BinderApi';

export default function useCreateBinder({ onSuccess }) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
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
