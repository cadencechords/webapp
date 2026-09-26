import { useQuery } from '@tanstack/react-query';
import RoleApi from '../../api/rolesApi';
import type { Id, Role } from '../../types';

// The same object on every render: useCopy compares the role by reference, so
// a new `{}` each render would reset it during render forever. It has none of
// `Role`'s fields.
const noRole: Partial<Role> = {};

export default function useRole(
  id: Id,
  {
    placeholderData,
    onSuccess,
  }: { placeholderData?: Role; onSuccess?: (role: Role) => void } = {}
) {
  const {
    data = noRole,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery<Role, Error>({
    queryKey: ['roles', `${id}`],
    queryFn: async () => {
      return (await RoleApi.getOne(id)).data;
    },
    placeholderData: placeholderData || undefined,
    onSuccess: data => onSuccess?.(data),
  });

  return { data, isLoading, isError, isSuccess, error };
}
