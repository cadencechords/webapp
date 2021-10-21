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
			state.songBeingEdited.boldChords = action.payload.bold_chords;
			delete state.songBeingEdited.bold_chords;
			state.songBeingEdited.italicChords = action.payload.italic_chords;
			delete state.songBeingEdited.italic_chords;
		},
		updateSongContent: (state, action) => {
			state.songBeingEdited.content = action.payload;
		},
		updateSongBeingEdited: (state, action) => {
			state.songBeingEdited = { ...state.songBeingEdited, ...action.payload };
		},
	},
});

export const { setSongBeingEdited, updateSongContent, updateSongBeingEdited } = editorSlice.actions;

export default editorSlice.reducer;

export const selectSongBeingEdited = (state) => {
	return state.editor.songBeingEdited;
};
