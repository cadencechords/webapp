import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import axios from 'axios';
import type { Id, Membership } from '../types';

const MEMBERSHIPS_URL = import.meta.env.REACT_APP_API_URL + '/memberships';

export default class MembershipsApi {
  static assignRole(memberId: Id, roleName: string) {
    return axios.post<Membership>(
      `${MEMBERSHIPS_URL}/${memberId}/role?team_id=${getTeamId()}`,
      { name: roleName },
      { headers: constructAuthHeaders() }
    );
  }
}
