import { createSlice } from '@reduxjs/toolkit';

export const presenterSlice = createSlice({
  name: 'presenter',
  initialState: {
    songBeingPresented: {},
    setlistBeingPresented: {},
  },

  reducers: {
    setSongBeingPresented: (state, action) => {
      state.songBeingPresented = action.payload;
    },

    adjustSongBeingPresented: (state, action) => {
      state.songBeingPresented = {
        ...state.songBeingPresented,
        ...action.payload,
      };
    },

    setSetlistBeingPresented: (state, action) => {
      state.setlistBeingPresented = action.payload;
    },
  },
});

export const {
  setSongBeingPresented,
  adjustSongBeingPresented,
  setSetlistBeingPresented,
} = presenterSlice.actions;

export default presenterSlice.reducer;

export const selectSongBeingPresented = state => {
  return {
    ...state.presenter.songBeingPresented,
  };
};

export const selectSetlistBeingPresented = state => {
  return state.presenter.setlistBeingPresented;
};
