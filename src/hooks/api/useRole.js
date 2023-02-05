import { useQuery } from '@tanstack/react-query';
import RoleApi from '../../api/rolesApi';

export default function useRole(id, { placeholderData, onSuccess } = {}) {
  const {
    data = {},
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['roles', `${id}`],
    queryFn: async () => {
      return (await RoleApi.getOne(id)).data;
    },
    placeholderData: placeholderData || undefined,
    onSuccess: data => onSuccess?.(data),
  });

  return { data, isLoading, isError, isSuccess, error };
}
