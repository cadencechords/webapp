import { useMutation, useQuery } from '@tanstack/react-query';
import FormatPresetsApi from '../../api/formatPresetsApi';
import { reportError } from '../../utils/error';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentTeam, setCurrentTeam } from '../../store/authSlice';
import TeamApi from '../../api/TeamApi';

export function useFormatPresets() {
  const {
    data = [],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['format presets'],
    queryFn: async () => {
      return (await FormatPresetsApi.getAll()).data;
    },
  });

  return { data, isLoading, isError, isSuccess, error };
}

export function useSetDefaultFormat({ onSuccess } = {}) {
  const dispatch = useDispatch();
  const currentTeam = useSelector(selectCurrentTeam);
  const {
    isLoading,
    isSuccess,
    isError,
    error,
    mutate: run,
  } = useMutation({
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
