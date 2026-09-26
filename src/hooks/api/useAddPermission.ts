import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import RoleApi from '../../api/rolesApi';
import type { Id } from '../../types';

export default function useAddPermission({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<unknown, Error, { roleId: Id; permissionName: string }>({
    mutationFn: async ({ roleId, permissionName }) => {
      const { data } = await RoleApi.addPermission(roleId, permissionName);
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
