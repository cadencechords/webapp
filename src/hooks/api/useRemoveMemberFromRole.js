import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import MembershipsApi from '../../api/membershipsApi';

export default function useRemoveMemberFromRole({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
    mutationFn: async ({ memberId }) => {
      await MembershipsApi.assignRole(memberId, 'Member');
    },
    onMutate: async ({ roleId, memberId }) => {
      await queryClient.cancelQueries({ queryKey: ['roles', `${roleId}`] });
      const roleKey = ['roles', `${roleId}`];
      const role = queryClient.getQueryData(roleKey);
      const updatedRole = {
        ...role,
        memberships: role.memberships.filter(member => member.id !== memberId),
      };
      queryClient.setQueryData(roleKey, updatedRole);
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
