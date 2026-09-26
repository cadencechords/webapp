import { useQuery } from '@tanstack/react-query';
import BinderApi from '../../api/BinderApi';
import type { Binder } from '../../types';

export default function useBinders() {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery<Binder[], Error>({
    queryKey: ['binders'],
    queryFn: async () => {
      return (await BinderApi.getAll()).data;
    },
  });

  return { data, isLoading, isError, isSuccess, error };
}
