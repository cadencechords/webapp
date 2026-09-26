import { useQuery } from '@tanstack/react-query';
import TeamApi from '../../api/TeamApi';
import type { Membership } from '../../types';

export default function useTeamMembers() {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery<Membership[], Error>({
    queryKey: ['members'],
    queryFn: async () => {
      return (await TeamApi.getMemberships()).data;
    },
  });

  return { data, isLoading, isError, isSuccess, error };
}
