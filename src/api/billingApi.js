import axios from 'axios';
import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

const BILLING_URL = process.env.REACT_APP_API_URL + '/billing';

export default class BillingApi {
  static createCustomerPortalSession(returnUrl) {
    let request = {};

    if (returnUrl) request.return_url = returnUrl;

    return axios.post(
      `${BILLING_URL}/customer_portal_sessions?team_id=${getTeamId()}`,
      request,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
