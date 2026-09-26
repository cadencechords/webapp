import { useQuery } from '@tanstack/react-query';
import SubscriptionsApi from '../../api/subscriptionsApi';
import type { Subscription } from '../../types';

export default function useSubscription() {
  const {
    // A new `{}` each time, as before. Every `Subscription` field is optional.
    data = {},
    isLoading,
    isError,
    isSuccess,
    isFetching,
    error,
  } = useQuery<Subscription, Error>({
    queryKey: ['subscription'],
    queryFn: async () => {
      return (await SubscriptionsApi.getCurrentSubscription()).data;
    },
  });

  return { data, isLoading, isError, isSuccess, error, isFetching };
}
