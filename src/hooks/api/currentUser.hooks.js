import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import UserApi from '../../api/UserApi';

export function useCurrentUser(options = {}) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      return (await UserApi.getCurrentUser()).data;
    },
    ...options,
  });
  return { data, isLoading, isError, error };
}

export function useUpdateCurrentUser({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError, error } = useMutation({
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
