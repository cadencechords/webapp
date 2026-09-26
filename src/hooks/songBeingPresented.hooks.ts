import { useDispatch, useSelector } from 'react-redux';
import {
  adjustSongBeingPresented,
  selectSongBeingPresented,
} from '../store/presenterSlice';
import { useCallback } from 'react';

export function useSongOnScreen() {
  const song = useSelector(selectSongBeingPresented);
  const dispatch = useDispatch();

  const updateSongOnScreen = useCallback(
    (field, value) => {
      dispatch(adjustSongBeingPresented({ [field]: value }));
    },
    [dispatch]
  );

  const updateFormat = useCallback(
    (field, value) => {
      updateSongOnScreen('format', { ...song.format, [field]: value });
    },
    [updateSongOnScreen, song]
  );

  return { song, updateSongOnScreen, updateFormat };
}
