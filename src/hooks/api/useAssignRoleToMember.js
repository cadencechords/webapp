import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportError } from '../../utils/error';
import MembershipsApi from '../../api/membershipsApi';

export default function useAssignRoleToMember() {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
    mutationFn: async ({ memberId, roleName }) => {
      const { data } = await MembershipsApi.assignRole(memberId, roleName);
      return data;
    },
    onMutate: ({ roleName, memberId }) => {
      const role = queryClient
        .getQueryData(['roles'])
        ?.find(role => role.name === roleName);

      if (!role) return;

      const members = queryClient.getQueryData(['members']);
      const updatedMembers = members?.map(member =>
        member.id === memberId ? { ...member, role } : member
      );

      queryClient.setQueryData(['members'], updatedMembers);
    },
    onError: error => {
      reportError(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['members']);
      queryClient.invalidateQueries(['roles']);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
