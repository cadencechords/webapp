import { createSlice } from "@reduxjs/toolkit";
export const presenterSlice = createSlice({
	name: "presenter",
	initialState: {
		songBeingPresented: {},
		setBeingPresented: {},
	},

	reducers: {
		setSongBeingPresented: (state, action) => {
			state.songBeingPresented = action.payload;
		},

		adjustSongBeingPresented: (state, action) => {
			state.songBeingPresented = { ...state.songBeingPresented, ...action.payload };
		},
	},
});

export const { setSongBeingPresented, adjustSongBeingPresented } = presenterSlice.actions;

export default presenterSlice.reducer;

export const selectSongBeingPresented = (state) => {
	return state.presenter.songBeingPresented;
};
