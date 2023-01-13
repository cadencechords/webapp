import { useMutation } from '@tanstack/react-query';
import BillingApi from '../../api/billingApi';

export default function useCreateCustomerPortalSession() {
  const { isLoading, mutate: run } = useMutation({
    mutationFn: async () => {
      return (
        await BillingApi.createCustomerPortalSession(window.location.href)
      ).data;
    },
    onSuccess: data => {
      window.location = data.url;
    },
  });

  return { isLoading, run };
}
