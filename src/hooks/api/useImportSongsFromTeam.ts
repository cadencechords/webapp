import { useMutation, useQueryClient } from '@tanstack/react-query';
import ImportsApi from '../../api/importsApi';
import { reportError } from '../../utils/error';
import type { Id } from '../../types';

export default function useImportSongsFromTeam({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<void, Error, { songIds: Id[]; exportTeamId: Id }>({
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
