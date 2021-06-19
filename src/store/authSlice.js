import { createSlice } from "@reduxjs/toolkit";
const initialState = {
	accessToken: localStorage.getItem("access-token"),
	client: localStorage.getItem("client"),
	uid: localStorage.getItem("uid"),
	teamId: localStorage.getItem("teamId"),
	currentTeam: null,
	currentUser: null,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,

	reducers: {
		setAuth: (state, action) => {
			state.accessToken = action.payload.accessToken;
			state.uid = action.payload.uid;
			state.client = action.payload.client;
			localStorage.setItem("access-token", action.payload.accessToken);
			localStorage.setItem("uid", action.payload.uid);
			localStorage.setItem("client", action.payload.client);
		},

		setAccessToken: (state, action) => {},

		setTeamId: (state, action) => {
			state.teamId = action.payload;
			localStorage.setItem("teamId", action.payload);
		},
		setCurrentUser: (state, action) => {
			state.currentUser = action.payload;
		},

		setCurrentTeam: (state, action) => {
			state.currentTeam = action.payload;
		},

		setMembership: (state, action) => {
			state.currentUser.is_admin = action.payload.is_admin;
			state.currentUser.role = action.payload.role;
		},

		logOut: (state) => {
			delete state.accessToken;
			delete state.client;
			delete state.currentTeam;
			delete state.currentUser;
			delete state.teamId;
			delete state.uid;

			localStorage.removeItem("access-token");
			localStorage.removeItem("uid");
			localStorage.removeItem("client");
			localStorage.removeItem("teamId");
		},
	},
});

export const { setAuth, setTeamId, setCurrentUser, setCurrentTeam, logOut, setMembership } =
	authSlice.actions;

export default authSlice.reducer;

export const selectCredentials = (state) => {
	return {
		accessToken: state.auth.accessToken,
		client: state.auth.client,
		uid: state.auth.uid,
	};
};

export const selectTeamId = (state) => state?.auth.teamId;
export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectCurrentTeam = (state) => state.auth.currentTeam;

export const selectHasCredentials = (state) =>
	state.auth.accessToken && state.auth.client && state.auth.uid;
