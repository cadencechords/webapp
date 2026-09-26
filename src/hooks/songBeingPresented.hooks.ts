import { useDispatch, useSelector } from 'react-redux';
import {
  adjustSongBeingPresented,
  selectSongBeingPresented,
  type PresentedSong,
} from '../store/presenterSlice';
import { useCallback } from 'react';
import type { SongFormat } from '../types';

export function useSongOnScreen() {
  const song = useSelector(selectSongBeingPresented);
  const dispatch = useDispatch();

  const updateSongOnScreen = useCallback(
    <K extends keyof PresentedSong>(field: K, value: PresentedSong[K]) => {
      dispatch(adjustSongBeingPresented({ [field]: value }));
    },
    [dispatch]
  );

  const updateFormat = useCallback(
    <K extends keyof SongFormat>(field: K, value: SongFormat[K]) => {
      updateSongOnScreen('format', { ...song.format, [field]: value });
    },
    [updateSongOnScreen, song]
  );

  return { song, updateSongOnScreen, updateFormat };
}
