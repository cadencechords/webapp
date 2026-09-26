import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import axios from 'axios';
import type { Id, Membership, Role } from '../types';

const ROLES_URL = import.meta.env.REACT_APP_API_URL + '/roles';

export interface RoleUpdates {
  name?: string;
  description?: string;
}

export default class RolesApi {
  static getAll() {
    return axios.get<Role[]>(`${ROLES_URL}?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static getOne(id: Id) {
    return axios.get<Role>(`${ROLES_URL}/${id}?team_id=${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static addPermission(roleId: Id, permissionName: string) {
    return axios.post<unknown>(
      `${ROLES_URL}/${roleId}/permissions?team_id=${getTeamId()}`,
      { name: permissionName },
      { headers: constructAuthHeaders() }
    );
  }

  static removePermission(roleId: Id, permissionName: string) {
    return axios.delete<unknown>(
      `${ROLES_URL}/${roleId}/permissions?name=${permissionName}&team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static updateOne(updates: RoleUpdates, roleId: Id) {
    return axios.put<Role>(
      `${ROLES_URL}/${roleId}?team_id=${getTeamId()}`,
      updates,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static assignRoleBulk(memberIds: Id[], roleId: Id) {
    return axios.post<Membership[]>(
      `${ROLES_URL}/${roleId}/memberships?team_id=${getTeamId()}`,
      { membership_ids: memberIds },
      { headers: constructAuthHeaders() }
    );
  }

  static createOne(role: RoleUpdates) {
    return axios.post<Role>(`${ROLES_URL}?team_id=${getTeamId()}`, role, {
      headers: constructAuthHeaders(),
    });
  }

  static deleteOne(roleId: Id) {
    return axios.delete<unknown>(
      `${ROLES_URL}/${roleId}?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }
}
