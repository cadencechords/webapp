import { useQuery } from '@tanstack/react-query';
import ImportsApi from '../../api/importsApi';
import { reportError } from '../../utils/error';

export default function useImportableCadenceSongs(exportTeamId, { enabled }) {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['imports', 'teams', `${exportTeamId}`, 'songs'],
    queryFn: async () => {
      return (await ImportsApi.getImportableSongs(exportTeamId)).data;
    },
    onError: error => {
      reportError(error);
    },
    enabled,
  });

  return { data, isLoading, isError, isSuccess, error };
}
