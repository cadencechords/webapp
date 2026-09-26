import { constructAuthHeaders, getTeamId } from '../utils/AuthUtils';
import axios from 'axios';
import type { Id, Invitation, InvitationClaim } from '../types';

const INVITATIONS_URL = import.meta.env.REACT_APP_API_URL + '/invitations';

export interface InvitationSignUpDetails {
  token: string;
  password: string;
  passwordConfirmation: string;
  firstName?: string;
  lastName?: string;
}

export default class InvitationApi {
  static createOne(newInvite: { email?: string }) {
    if (newInvite) {
      const allowedParams: { email?: string; team_id?: Id | null } = {};

      if (newInvite.email) allowedParams.email = newInvite.email;

      allowedParams.team_id = getTeamId();

      return axios.post<Invitation>(INVITATIONS_URL, allowedParams, {
        headers: constructAuthHeaders(),
      });
    }
  }

  static getAll() {
    return axios.get<Invitation[]>(
      `${INVITATIONS_URL}?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static resendOne(invitationId: Id) {
    return axios.post<unknown>(
      `${INVITATIONS_URL}/${invitationId}/resend`,
      {
        team_id: getTeamId(),
      },
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static deleteOne(invitationId: Id) {
    return axios.delete<unknown>(
      `${INVITATIONS_URL}/${invitationId}?team_id=${getTeamId()}`,
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static claimOne(token: string) {
    return axios.post<InvitationClaim>(
      `${INVITATIONS_URL}/claim`,
      {
        token,
      },
      {
        headers: constructAuthHeaders(),
      }
    );
  }

  static signUpThroughToken({
    token,
    password,
    passwordConfirmation,
    firstName,
    lastName,
  }: InvitationSignUpDetails) {
    return axios.post<InvitationClaim>(`${INVITATIONS_URL}/signup`, {
      token,
      password,
      password_confirmation: passwordConfirmation,
      first_name: firstName,
      last_name: lastName,
    });
  }
}
