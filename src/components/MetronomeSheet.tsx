import { useState } from 'react';

import { EDIT_SONGS } from '../utils/constants';
import Metronome from './Metronome';
import SheetHeader from './SheetHeader';
import SongApi from '../api/SongApi';
import type { Song } from '../types';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';

type MetronomeSheetProps = {
  song: Song;
  /** Gets undefined from the metronome's minus button when there's no bpm. */
  onSongChange: (field: 'bpm', value: number | undefined) => void;
  className?: string;
};

export default function MetronomeSheet({
  song,
  onSongChange,
  className = '',
}: MetronomeSheetProps) {
  const [updates, setUpdates] = useState<{ bpm: number | undefined } | null>();
  const [loading, setLoading] = useState(false);
  const currentMember = useSelector(selectCurrentMember);
  // Drop unsaved changes when another song is shown.
  const [previousSongId, setPreviousSongId] = useState(song.id);
  if (song.id !== previousSongId) {
    setPreviousSongId(song.id);
    setUpdates(null);
  }

  function handleBpmChange(bpm: number | undefined) {
    // Non-null: kept as before, this throws if the membership hasn't loaded.
    if (currentMember!.can(EDIT_SONGS)) {
      setUpdates({ bpm });
    }

    onSongChange('bpm', bpm);
  }

  async function handleSaveChanges() {
    try {
      setLoading(true);
      // Only the save button calls this, and it renders only with updates.
      await SongApi.updateOneById(song.id, updates!);
    } catch (error) {
      reportError(error);
    } finally {
      setLoading(false);
      setUpdates(null);
    }
  }

  return (
    <div className={className}>
      <SheetHeader
        title="Metronome"
        // Non-null: updates are set only once can() passed above.
        onSave={
          updates && currentMember!.can(EDIT_SONGS)
            ? handleSaveChanges
            : undefined
        }
        saving={loading}
      />
      <Metronome bpm={song?.bpm} onBpmChange={handleBpmChange} />
    </div>
  );
}
