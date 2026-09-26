import { useQuery } from '@tanstack/react-query';
import RoleApi from '../../api/rolesApi';
import type { Id, Role } from '../../types';

export default function useRole(
  id: Id,
  {
    placeholderData,
    onSuccess,
  }: { placeholderData?: Role; onSuccess?: (role: Role) => void } = {}
) {
  const {
    // A new `{}` each time, as before. It has none of `Role`'s fields.
    data = {} as Partial<Role>,
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
