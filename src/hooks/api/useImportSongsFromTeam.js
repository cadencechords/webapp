import { useMutation, useQueryClient } from '@tanstack/react-query';
import ImportsApi from '../../api/importsApi';
import { reportError } from '../../utils/error';

export default function useImportSongsFromTeam({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
    mutationFn: async ({ songIds, exportTeamId }) => {
      await ImportsApi.importSongsFromTeam(exportTeamId, songIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['songs']);
      onSuccess?.();
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
