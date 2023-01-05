import { useQuery } from '@tanstack/react-query';
import TeamApi from '../../api/TeamApi';

export default function useTeamMembers() {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      return (await TeamApi.getMemberships()).data;
    },
  });

  return { data, isLoading, isError, isSuccess, error };
}
