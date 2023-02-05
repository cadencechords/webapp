import { useMutation, useQueryClient } from '@tanstack/react-query';
import RoleApi from '../../api/rolesApi';
import { reportError } from '../../utils/error';

export default function useDeleteRole({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
    mutationFn: async id => {
      return await RoleApi.deleteOne(id);
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries(['roles']);
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
