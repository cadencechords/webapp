import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import RoleApi from '../../api/rolesApi';
import type { Id, Membership, Role } from '../../types';

export default function useAddMembersToRole({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<Membership[], Error, { memberIds: Id[]; roleId: Id }>({
    mutationFn: async ({ memberIds, roleId }) => {
      const { data } = await RoleApi.assignRoleBulk(memberIds, roleId);
      return data;
    },
    onSuccess: (data, { roleId }) => {
      const roleKey = ['roles', `${roleId}`];
      // Members are added from the role's page, which has loaded the role and
      // its memberships into this query.
      const role = queryClient.getQueryData<Role>(roleKey)!;
      const updatedRole = {
        ...role,
        memberships: role.memberships!.concat(data),
      };
      queryClient.setQueryData<Role>(roleKey, updatedRole);

      queryClient.invalidateQueries(roleKey);
      onSuccess?.();
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
