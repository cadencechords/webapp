import { useQuery } from '@tanstack/react-query';
import SetlistApi from '../../api/SetlistApi';
import type { Id, Setlist } from '../../types';

export default function useSetlist(
  id: Id,
  { enabled = true }: { enabled?: boolean } = {}
) {
  const {
    // Reading a field of the `[]` placeholder gives `undefined`, as a
    // `Partial<Setlist>` does.
    data = [] as Partial<Setlist>,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery<Setlist, Error>({
    queryKey: ['setlists', `${id}`],
    queryFn: async () => {
      return (await SetlistApi.getOne(id)).data;
    },
    enabled,
  });

  return { data, isLoading, isError, isSuccess, error };
}
