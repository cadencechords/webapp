import { useMutation, useQuery } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import FormatPresetsApi from '../../api/formatPresetsApi';
import { reportError } from '../../utils/error';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentTeam, setCurrentTeam } from '../../store/authSlice';
import TeamApi from '../../api/TeamApi';
import type { FormatPreset } from '../../types';

export function useFormatPresets() {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery<FormatPreset[], Error>({
    queryKey: ['format presets'],
    queryFn: async () => {
      return (await FormatPresetsApi.getAll()).data;
    },
  });

  return { data, isLoading, isError, isSuccess, error };
}

export function useSetDefaultFormat({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const dispatch = useDispatch();
  const currentTeam = useSelector(selectCurrentTeam);
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation<
    AxiosResponse<unknown>,
    Error,
    // `FormatPresets` passes its selected preset, which starts as the team's
    // default and can be unset.
    FormatPreset | undefined
  >({
    mutationFn: async formatPreset => {
      return await TeamApi.setDefaultFormat(formatPreset?.id);
    },
    onSuccess: (_data, formatPreset) => {
      dispatch(
        setCurrentTeam({ ...currentTeam, default_format: formatPreset })
      );
      onSuccess?.();
    },
    onError: error => {
      reportError(error);
    },
  });

  return { isLoading, isSuccess, isError, error, run };
}
