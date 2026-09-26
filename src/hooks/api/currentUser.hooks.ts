import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import UserApi, { type UserUpdates } from '../../api/UserApi';
import type { User } from '../../types';

export function useCurrentUser(
  options: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'> = {}
) {
  const { data, isLoading, isError, error } = useQuery<User, Error>({
    queryKey: ['me'],
    queryFn: async () => {
      return (await UserApi.getCurrentUser()).data;
    },
    ...options,
  });
  return { data, isLoading, isError, error };
}

export function useUpdateCurrentUser({
  onSuccess,
}: { onSuccess?: (user: User) => void } = {}) {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError, error } = useMutation<
    User,
    Error,
    UserUpdates
  >({
    mutationFn: async updates => {
      return (await UserApi.updateCurrentUser(updates)).data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries(['me']);
      onSuccess?.(data);
    },
  });
  return { run: mutate, isLoading, isError, error };
}
