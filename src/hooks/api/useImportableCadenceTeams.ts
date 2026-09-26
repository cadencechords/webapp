import { useQuery } from '@tanstack/react-query';
import ImportsApi from '../../api/importsApi';
import { reportError } from '../../utils/error';
import type { ImportableTeam } from '../../types';

export default function useImportableCadenceTeams() {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery<ImportableTeam[], Error>({
    queryKey: ['imports', 'teams'],
    queryFn: async () => {
      return (await ImportsApi.getImportableTeams()).data;
    },
    onError: error => {
      reportError(error);
    },
  });

  return { data, isLoading, isError, isSuccess, error };
}
