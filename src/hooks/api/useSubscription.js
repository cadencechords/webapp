import { useQuery } from '@tanstack/react-query';
import SubscriptionsApi from '../../api/subscriptionsApi';

export default function useSubscription() {
  const {
    data = {},
    isLoading,
    isError,
    isSuccess,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      return (await SubscriptionsApi.getCurrentSubscription()).data;
    },
  });

  return { data, isLoading, isError, isSuccess, error, isFetching };
}
