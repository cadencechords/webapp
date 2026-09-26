import axios from 'axios';
import type { User } from '../types';

const AUTH_URL = `${import.meta.env.REACT_APP_API_URL}/auth`;
const WEB_APP_URL = import.meta.env.REACT_APP_URL;

export interface SignUpDetails {
  email: string;
  password: string;
  passwordConfirmation: string;
  firstName?: string;
  lastName?: string;
}

/** The new password and the auth params from the reset link. */
export interface ResetPasswordConfig {
  password: string;
  passwordConfirmation: string;
  'access-token'?: string;
  uid?: string;
  client?: string;
}

/** Devise Token Auth wraps the user in `data`; the tokens are in the headers. */
export interface AuthResponse {
  data: User;
}

export default class AuthApi {
  static signUp({
    email,
    password,
    passwordConfirmation,
    firstName,
    lastName,
  }: SignUpDetails) {
    return axios.post<AuthResponse>(
      import.meta.env.REACT_APP_API_URL + '/auth',
      {
        email,
        password,
        password_confirmation: passwordConfirmation,
        first_name: firstName,
        last_name: lastName,
        sign_up_source: 'web',
      }
    );
  }

  static login(email: string, password: string) {
    return axios.post<AuthResponse>(
      import.meta.env.REACT_APP_API_URL + '/auth/sign_in',
      {
        email,
        password,
      }
    );
  }

  static sendResetPasswordInstructions(email: string) {
    return axios.post<unknown>(`${AUTH_URL}/password`, {
      email,
      redirect_url: `${WEB_APP_URL}/reset_password`,
    });
  }

  static resetPassword(config: ResetPasswordConfig) {
    return axios.put<unknown>(
      `${AUTH_URL}/password`,
      {
        password: config.password,
        password_confirmation: config.passwordConfirmation,
      },
      {
        headers: {
          'access-token': config['access-token'],
          uid: config.uid,
          client: config.client,
        },
      }
    );
  }
}
