import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import MembershipsApi from '../../api/membershipsApi';
import type { Id, Role } from '../../types';

export default function useRemoveMemberFromRole({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<void, Error, { memberId: Id; roleId: Id }>({
    mutationFn: async ({ memberId }) => {
      await MembershipsApi.assignRole(memberId, 'Member');
    },
    onMutate: async ({ roleId, memberId }) => {
      await queryClient.cancelQueries({ queryKey: ['roles', `${roleId}`] });
      const roleKey = ['roles', `${roleId}`];
      // Members are removed from the role's page, which has loaded the role
      // and its memberships into this query.
      const role = queryClient.getQueryData<Role>(roleKey)!;
      const updatedRole = {
        ...role,
        memberships: role.memberships!.filter(member => member.id !== memberId),
      };
      queryClient.setQueryData<Role>(roleKey, updatedRole);
    },
    onSuccess: _data => {
      onSuccess?.();
    },
    onError: error => {
      reportError(error);
    },
    onSettled: (_data, _error, { roleId }) => {
      queryClient.invalidateQueries(['roles', `${roleId}`]);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
