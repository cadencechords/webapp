import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import RoleApi from '../../api/rolesApi';

export default function useAddMembersToRole({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
    mutationFn: async ({ memberIds, roleId }) => {
      const { data } = await RoleApi.assignRoleBulk(memberIds, roleId);
      return data;
    },
    onSuccess: (data, { roleId }) => {
      const roleKey = ['roles', `${roleId}`];
      const role = queryClient.getQueryData(roleKey);
      const updatedRole = {
        ...role,
        memberships: role.memberships.concat(data),
      };
      queryClient.setQueryData(roleKey, updatedRole);

      queryClient.invalidateQueries(roleKey);
      onSuccess?.();
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
