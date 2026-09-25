import { useEffect, useState } from 'react';

import Button from './Button';
import { EDIT_SONGS } from '../utils/constants';
import Metronome from './Metronome';
import SectionTitle from './SectionTitle';
import SongApi from '../api/SongApi';
import type { Song } from '../types';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';

type MetronomeSheetProps = {
  song: Song;
  onSongChange: (field: 'bpm', value: number) => void;
  className?: string;
};

export default function MetronomeSheet({
  song,
  onSongChange,
  className = '',
}: MetronomeSheetProps) {
  const [updates, setUpdates] = useState<{ bpm: number } | null>();
  const [loading, setLoading] = useState(false);
  const currentMember = useSelector(selectCurrentMember);

  useEffect(() => {
    setUpdates(null);
  }, [song.id]);

  function handleBpmChange(bpm: number) {
    if (currentMember.can(EDIT_SONGS)) {
      setUpdates({ bpm });
    }

    onSongChange('bpm', bpm);
  }

  async function handleSaveChanges() {
    try {
      setLoading(true);
      await SongApi.updateOneById(song.id, updates);
    } catch (error) {
      reportError(error);
    } finally {
      setLoading(false);
      setUpdates(null);
    }
  }

  return (
    <div className={className}>
      <SectionTitle
        title={
          <>
            Metronome
            {updates && currentMember.can(EDIT_SONGS) && (
              <Button
                variant="open"
                size="xs"
                onClick={handleSaveChanges}
                className="ml-4"
                loading={loading}
              >
                Save changes
              </Button>
            )}
          </>
        }
        className="pb-2 pl-2"
      />
      <Metronome bpm={song?.bpm} onBpmChange={handleBpmChange} />
    </div>
  );
}
