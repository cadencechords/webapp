import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Id, Role, Team, User } from '../types';
import type { RootState } from './store';

export interface AuthState {
  // Every field is optional because logOut deletes them all.
  accessToken?: string | null;
  client?: string | null;
  uid?: string | null;
  /** A string from localStorage, or the number setTeamId was given. */
  teamId?: Id | null;
  currentTeam?: Team | null;
  currentUser?: User | null;
}

/** The headers devise_token_auth signs requests with. */
export interface Credentials {
  accessToken: string;
  client: string;
  uid: string;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('access-token'),
  client: localStorage.getItem('client'),
  uid: localStorage.getItem('uid'),
  teamId: localStorage.getItem('teamId'),
  currentTeam: null,
  currentUser: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setAuth: (state, action: PayloadAction<Credentials>) => {
      state.accessToken = action.payload.accessToken;
      state.uid = action.payload.uid;
      state.client = action.payload.client;
      localStorage.setItem('access-token', action.payload.accessToken);
      localStorage.setItem('uid', action.payload.uid);
      localStorage.setItem('client', action.payload.client);
    },

    setAccessToken: (state, action: PayloadAction<unknown>) => {},

    setTeamId: (state, action: PayloadAction<Id>) => {
      state.teamId = action.payload;
      // localStorage stores a number as its string, as String() does.
      localStorage.setItem('teamId', String(action.payload));
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },

    /**
     * Takes the user the API returns after an update. Merged, so fields that
     * response leaves out (`role`) stay.
     */
    updateCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
    },

    setCurrentTeam: (state, action: PayloadAction<Team | null>) => {
      state.currentTeam = action.payload;
    },

    setMembership: (state, action: PayloadAction<{ role: Role }>) => {
      // Non-null: dispatched after the current user loads (SecuredRoutes,
      // useOneSignal). Throws otherwise, as it always has.
      state.currentUser!.role = action.payload.role;
    },

    logOut: state => {
      delete state.accessToken;
      delete state.client;
      delete state.currentTeam;
      delete state.currentUser;
      delete state.teamId;
      delete state.uid;

      localStorage.removeItem('access-token');
      localStorage.removeItem('uid');
      localStorage.removeItem('client');
      localStorage.removeItem('teamId');
    },
  },
});

export const {
  setAuth,
  setTeamId,
  setCurrentUser,
  setCurrentTeam,
  logOut,
  setMembership,
  updateCurrentUser,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCredentials = (state: RootState) => {
  return {
    accessToken: state.auth.accessToken,
    client: state.auth.client,
    uid: state.auth.uid,
  };
};

export const selectTeamId = (state: RootState) => state?.auth.teamId;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectCurrentTeam = (state: RootState) => state.auth.currentTeam;
/**
 * The current user with their permissions on the current team, or null until
 * their membership loads (`setMembership`).
 */
export const selectCurrentMember = (state: RootState) => {
  // Non-null (here and below): kept as before, this throws when no user is
  // signed in rather than returning null.
  if (!state.auth.currentUser!.role) return null;

  const permissions = state.auth.currentUser!.role?.permissions?.map(
    permission => permission.name
  );
  return {
    permissions,
    ...state.auth.currentUser!,
    can: (permission: string) => {
      return permissions?.includes(permission);
    },
  };
};

export const selectHasCredentials = (state: RootState) =>
  state.auth.accessToken && state.auth.client && state.auth.uid;
