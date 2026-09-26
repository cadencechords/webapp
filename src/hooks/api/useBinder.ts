import { useQuery } from '@tanstack/react-query';
import BinderApi from '../../api/BinderApi';
import type { Binder, Id } from '../../types';

export default function useBinder(
  id: Id,
  { placeholderData }: { placeholderData?: Binder } = {}
) {
  const {
    // A new `{}` each time, as before. It has none of `Binder`'s fields.
    data = {} as Partial<Binder>,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery<Binder, Error>({
    queryKey: ['binders', `${id}`],
    queryFn: async () => {
      return (await BinderApi.getOneById(id)).data;
    },
    placeholderData: placeholderData || undefined,
  });

  return { data, isLoading, isError, isSuccess, error };
}
