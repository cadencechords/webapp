import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import type { AnnotationPath, Marking, Setlist, Song } from '../types';

/** A song on the presenter pages, with what pro teams can draw on it. */
export type PresentedSong = Song & {
  annotations?: AnnotationPath[];
  markings?: Marking[];
};

export interface PresenterState {
  /**
   * `{}` until SongDetailPage stores a whole song before it opens the song
   * presenter.
   */
  songBeingPresented: Partial<PresentedSong>;
  /**
   * `{}` until SetlistDetailPage stores a whole setlist (or SetPresenterPage
   * fetches one), and cleared to `{}` again by EditorNavbar.
   */
  setlistBeingPresented: Partial<Setlist>;
}

export const presenterSlice = createSlice({
  name: 'presenter',
  // `as`: widens the empty objects to the state the reducers store.
  initialState: {
    songBeingPresented: {},
    setlistBeingPresented: {},
  } as PresenterState,

  reducers: {
    setSongBeingPresented: (state, action: PayloadAction<PresentedSong>) => {
      state.songBeingPresented = action.payload;
    },

    adjustSongBeingPresented: (
      state,
      action: PayloadAction<Partial<PresentedSong>>
    ) => {
      state.songBeingPresented = {
        ...state.songBeingPresented,
        ...action.payload,
      };
    },

    setSetlistBeingPresented: (
      state,
      action: PayloadAction<Partial<Setlist>>
    ) => {
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

export const selectSongBeingPresented = (state: RootState) => {
  return {
    ...state.presenter.songBeingPresented,
  };
};

export const selectSetlistBeingPresented = (state: RootState) => {
  return state.presenter.setlistBeingPresented;
};
