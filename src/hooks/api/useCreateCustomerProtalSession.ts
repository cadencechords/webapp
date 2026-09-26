import { useMutation } from '@tanstack/react-query';
import BillingApi, { type CustomerPortalSession } from '../../api/billingApi';

export default function useCreateCustomerPortalSession() {
  const { isLoading, mutate: run } = useMutation<
    CustomerPortalSession,
    Error,
    void
  >({
    mutationFn: async () => {
      return (
        await BillingApi.createCustomerPortalSession(window.location.href)
      ).data;
    },
    onSuccess: data => {
      window.location.href = data.url;
    },
  });

  return { isLoading, run };
}
