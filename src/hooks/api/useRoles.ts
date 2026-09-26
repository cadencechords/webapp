import { useQuery } from '@tanstack/react-query';
import RoleApi from '../../api/rolesApi';
import type { Role } from '../../types';

export default function useRoles() {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery<Role[], Error>({
    queryKey: ['roles'],
    queryFn: async () => {
      return (await RoleApi.getAll()).data;
    },
  });

  return { data, isLoading, isError, isSuccess, error };
}
