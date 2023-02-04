import Button from './Button';
import { EDIT_SONGS } from '../utils/constants';
import PlusIcon from '@heroicons/react/outline/PlusIcon';
import RoadmapDragDropContext from './RoadmapDragDopContext';
import SongApi from '../api/SongApi';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function Roadmap({
  song,
  onSongChange,
  onDragStart,
  onDragEnd,
}) {
  const [updates, setUpdates] = useState();
  const currentMember = useSelector(selectCurrentMember);
  const [loading, setLoading] = useState(false);

  function handleAddSection() {
    let updatedRoadmap = song.roadmap ? [...song.roadmap, 'New'] : ['New'];
    onSongChange('roadmap', updatedRoadmap);
  }

  function handleChange(newSections) {
    if (currentMember.can(EDIT_SONGS)) {
      setUpdates({ roadmap: newSections });
    }

    onSongChange('roadmap', newSections);
  }

  async function handleSaveChanges() {
    try {
      setLoading(true);
      await SongApi.updateOneById(song.id, updates);
      setUpdates(null);
    } catch (error) {
      reportError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {updates && (
        <Button
          className=""
          size="xs"
          variant="open"
          onClick={handleSaveChanges}
          loading={loading}
        >
          Save changes
        </Button>
      )}
      <div className="flex items-center mb-2">
        <Button
          variant="accent"
          size="xs"
          className="mr-4 flex-center"
          onClick={handleAddSection}
        >
          <PlusIcon className="w-3 h-3 mr-2" />
          Roadmap
        </Button>
        {song.roadmap && (
          <RoadmapDragDropContext
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            sections={song.roadmap}
            onChange={handleChange}
          />
        )}
      </div>
    </>
  );
}
