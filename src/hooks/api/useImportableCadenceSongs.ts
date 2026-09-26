import { useQuery } from '@tanstack/react-query';
import ImportsApi from '../../api/importsApi';
import { reportError } from '../../utils/error';
import type { Id, Song } from '../../types';

export default function useImportableCadenceSongs(
  exportTeamId: Id,
  { enabled }: { enabled?: boolean }
) {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery<Song[], Error>({
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
