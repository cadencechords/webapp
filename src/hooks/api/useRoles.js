import { useQuery } from '@tanstack/react-query';
import RoleApi from '../../api/rolesApi';

export default function useRoles() {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      return (await RoleApi.getAll()).data;
    },
  });

  return { data, isLoading, isError, isSuccess, error };
}
