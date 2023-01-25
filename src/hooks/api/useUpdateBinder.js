import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import BinderApi from '../../api/BinderApi';

export default function useUpdateBinder({ onSuccess }) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
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
