import { createSlice } from "@reduxjs/toolkit";
const initialState = {
	accessToken: localStorage.getItem("access-token"),
	client: localStorage.getItem("client"),
	uid: localStorage.getItem("uid"),
	teamId: localStorage.getItem("teamId"),
};

export const authSlice = createSlice({
	name: "auth",
	initialState,

	reducers: {
		setAuth: (state, action) => {
			state.accessToken = action.payload.accessToken;
			state.uid = action.payload.uid;
			state.client = action.payload.client;
		},

		setTeam: (state, action) => {
			console.log("setting team:", action.payload);
			state.teamId = action.payload;
		},
	},
});

export const { setAuth, setTeam } = authSlice.actions;

export default authSlice.reducer;

export const selectAuth = (state) => {
	return {
		accessToken: state.auth.accessToken,
		client: state.auth.client,
		uid: state.auth.uid,
	};
};

export const selectTeamId = (state) => state.teamId;
