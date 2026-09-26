import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import RoleApi from '../../api/rolesApi';
import { reportError } from '../../utils/error';
import type { Id } from '../../types';

export default function useDeleteRole({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<AxiosResponse<unknown>, Error, Id>({
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
