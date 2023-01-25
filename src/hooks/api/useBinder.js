import { useQuery } from '@tanstack/react-query';
import BinderApi from '../../api/BinderApi';

export default function useBinder(id, { placeholderData } = {}) {
  const {
    data = {},
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['binders', `${id}`],
    queryFn: async () => {
      return (await BinderApi.getOneById(id)).data;
    },
    placeholderData: placeholderData || undefined,
  });

  return { data, isLoading, isError, isSuccess, error };
}
