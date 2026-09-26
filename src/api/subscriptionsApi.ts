import api from './api';
import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';
import type { Subscription } from '../types';

export default class SubscriptionsApi {
  static getCurrentSubscription() {
    return api().get<Subscription>(`/teams/${getTeamId()}/subscription`, {
      headers: constructAuthHeaders(),
    });
  }
}
