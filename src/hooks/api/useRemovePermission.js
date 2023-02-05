import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import RoleApi from '../../api/rolesApi';

export default function useRemovePermission({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
    mutationFn: async ({ roleId, permissionName }) => {
      const { data } = await RoleApi.removePermission(roleId, permissionName);
      return data;
    },
    onSuccess: (_data, { roleId }) => {
      queryClient.invalidateQueries(['roles', `${roleId}`]);
      onSuccess?.();
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
