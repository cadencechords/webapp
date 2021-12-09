import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	songsCache: null,
};

export const cacheSlice = createSlice({
	name: "cache",
	initialState,

	reducers: {
		setSongsCache: (state, action) => {
			state.songsCache = action.payload;
		},
	},
});

export const { setSongsCache } = cacheSlice.actions;

export default cacheSlice.reducer;

export const selectSongsCache = (state) => state.cache.songsCache;
