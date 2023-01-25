import { useQuery } from '@tanstack/react-query';
import BinderApi from '../../api/BinderApi';

export default function useBinders() {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['binders'],
    queryFn: async () => {
      return (await BinderApi.getAll()).data;
    },
  });

  return { data, isLoading, isError, isSuccess, error };
}
