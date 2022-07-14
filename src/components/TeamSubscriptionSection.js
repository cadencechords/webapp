import React, { useState } from 'react';
import BillingApi from '../api/billingApi';
import { reportError } from '../utils/error';
import Button from './Button';

export default function TeamSubscriptionSection() {
  const [loading, setLoading] = useState(false);

  async function handleCreateCustomerPortalSession() {
    try {
      setLoading(true);
      let { data } = await BillingApi.createCustomerPortalSession(
        window.location.href
      );
      window.location = data.url;
    } catch (error) {
      reportError(error);
      setLoading(false);
    }
  }
  return (
    <Button
      variant="outlined"
      full={true}
      name="manage billing"
      className="mt-2 mb-4"
      onClick={handleCreateCustomerPortalSession}
      loading={loading}
    >
      Manage billing
    </Button>
  );
}
