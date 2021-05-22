import { createSlice } from "@reduxjs/toolkit";
export const editorSlice = createSlice({
	name: "editor",
	initialState: {
		songBeingEdited: {},
	},

	reducers: {
		setSongBeingEdited: (state, action) => {
			state.songBeingEdited = action.payload;
			state.songBeingEdited.fontSize = action.payload.font_size;
			delete state.songBeingEdited.font_size;
		},
		updateSongContent: (state, action) => {
			state.songBeingEdited.content = action.payload;
		},
	},
});

export const { setSongBeingEdited, updateSongContent } = editorSlice.actions;

export default editorSlice.reducer;

export const selectSongBeingEdited = (state) => {
	return state.editor.songBeingEdited;
};
