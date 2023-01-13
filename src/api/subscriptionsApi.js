import api from './api';
import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

export default class SubscriptionsApi {
  static getCurrentSubscription() {
    return api().get(`/teams/${getTeamId()}/subscription`, {
      headers: constructAuthHeaders(),
    });
  }
}
