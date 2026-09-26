import axios from 'axios';
import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

const BILLING_URL = import.meta.env.REACT_APP_API_URL + '/billing';

/** A Stripe customer portal session to redirect to. */
export interface CustomerPortalSession {
  url: string;
}

export default class BillingApi {
  static createCustomerPortalSession(returnUrl?: string) {
    const request: { return_url?: string } = {};

    if (returnUrl) request.return_url = returnUrl;

    return axios.post<CustomerPortalSession>(
      `${BILLING_URL}/customer_portal_sessions?team_id=${getTeamId()}`,
      request,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
