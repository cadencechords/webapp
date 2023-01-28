import { useMutation, useQueryClient } from '@tanstack/react-query';
import BinderApi from '../../api/BinderApi';
import { reportError } from '../../utils/error';

export default function useDeleteBinder({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
    mutationFn: id => {
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
