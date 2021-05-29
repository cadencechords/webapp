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
	},
});

export const { setAuth, setTeamId, setCurrentUser, setCurrentTeam } = authSlice.actions;

export default authSlice.reducer;

export const selectAuth = (state) => {
	return {
		accessToken: state.auth.accessToken,
		client: state.auth.client,
		uid: state.auth.uid,
	};
};

export const selectTeamId = (state) => state?.auth.teamId;
export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectCurrentTeam = (state) => state.auth.currentTeam;
