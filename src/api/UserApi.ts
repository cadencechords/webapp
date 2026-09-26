import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';

import FileApi from './FileApi';
import axios from 'axios';
import api from './api';
import type { Id, Membership, User } from '../types';

const USERS_URL = import.meta.env.REACT_APP_API_URL + '/users';

export interface UserUpdates {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  timezone?: string;
  prefers_hide_chords?: boolean;
}

export default class UserApi {
  static getCurrentUser() {
    return api().get<User>('/users/me', { headers: constructAuthHeaders() });
  }

  static updateCurrentUser(updates: UserUpdates) {
    return axios.put<User>(`${USERS_URL}/me`, updates, {
      headers: constructAuthHeaders(),
    });
  }

  static getTeamMembership() {
    return axios.get<Membership>(
      `${USERS_URL}/me/memberships?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  /** A team member: the user, with their `position` on this team. */
  static getMember(id: Id) {
    return axios.get<User>(`${USERS_URL}/${id}/memberships/${getTeamId()}`, {
      headers: constructAuthHeaders(),
    });
  }

  static updateMembership(userId: Id, updates: { position?: string }) {
    if (updates && userId) {
      const allowedParams: { position?: string } = {};

      if ('position' in updates) allowedParams.position = updates.position;

      return axios.put<unknown>(
        `${USERS_URL}/${userId}/memberships/${getTeamId()}`,
        allowedParams,
        {
          headers: constructAuthHeaders(),
        }
      );
    }
  }

  static deleteMembership(userId: Id) {
    return axios.delete<unknown>(
      `${USERS_URL}/${userId}/memberships/${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static addImageToUser(image: Blob) {
    return FileApi.addImageToUser(image);
  }

  static removeImageFromUser() {}
}
