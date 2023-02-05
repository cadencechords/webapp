import { useQuery } from '@tanstack/react-query';
import PermissionApi from '../../api/permissionsApi';

export default function usePermissions() {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      return (await PermissionApi.getAll()).data;
    },
  });

  return { data, isLoading, isError, isSuccess, error };
}
