import Button from './Button';
import { EDIT_SONGS } from '../utils/constants';
import RoadmapDragDropContext from './RoadmapDragDopContext';
import SongApi, { type SongUpdates } from '../api/SongApi';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Icon from './Icon';
import type { Song } from '../types';

type RoadmapProps = {
  song: Pick<Song, 'id' | 'roadmap'>;
  onSongChange: (field: 'roadmap', value: string[]) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  /** Not read. */
  onToggleRoadmap?: () => void;
};

export default function Roadmap({
  song,
  onSongChange,
  onDragStart,
  onDragEnd,
}: RoadmapProps) {
  /** Unsaved changes, if the member can edit songs. */
  const [updates, setUpdates] = useState<Pick<SongUpdates, 'roadmap'> | null>();
  const currentMember = useSelector(selectCurrentMember);
  const [loading, setLoading] = useState(false);

  function handleAddSection() {
    const updatedRoadmap = song.roadmap ? [...song.roadmap, 'New'] : ['New'];
    onSongChange('roadmap', updatedRoadmap);
  }

  function handleChange(newSections: string[]) {
    // Non-null: kept as before, this throws if the membership hasn't loaded.
    if (currentMember!.can(EDIT_SONGS)) {
      setUpdates({ roadmap: newSections });
    }

    onSongChange('roadmap', newSections);
  }

  async function handleSaveChanges() {
    try {
      setLoading(true);
      // Only the save button calls this, and it renders only with updates.
      await SongApi.updateOneById(song.id, updates!);
      setUpdates(null);
    } catch (error) {
      reportError(error);
    } finally {
      setLoading(false);
    }
  }

  const hasSections = !!song.roadmap && song.roadmap.length > 0;

  // The roadmap as a small surface-container-low card: a header (a route
  // icon, "Roadmap", and Save changes while there are unsaved edits) over
  // the sections in play order, then a button to add one.
  return (
    <section className="mb-4 rounded-large bg-surface-container-low">
      <div className="flex items-center gap-2 pl-3 pr-2 pt-2 min-h-10">
        <Icon
          name="route"
          className="w-5 h-5 shrink-0 text-on-surface-variant"
        />
        <h2 className="flex-1 min-w-0 font-plain text-title-small text-on-surface-variant">
          Roadmap
        </h2>
        {updates && (
          <Button
            size="xs"
            variant="accent"
            className="shrink-0"
            onClick={handleSaveChanges}
            loading={loading}
          >
            Save changes
          </Button>
        )}
      </div>
      <div className="flex items-center gap-1 pb-1 pr-2">
        {hasSections && (
          <div className="flex-1 min-w-0">
            <RoadmapDragDropContext
              onDragEnd={onDragEnd}
              onDragStart={onDragStart}
              // Non-null: hasSections checked it.
              sections={song.roadmap!}
              onChange={handleChange}
            />
          </div>
        )}
        {/* Labelled while there's nothing yet; an icon button after the
            sections once there are. */}
        <button
          type="button"
          aria-label={hasSections ? 'Add section' : undefined}
          onClick={handleAddSection}
          className={
            hasSections
              ? 'flex-center w-10 h-10 shrink-0 rounded-full text-primary state-layer-flat focus-ring'
              : 'flex-center gap-2 h-10 my-1 ml-2 pl-3 pr-4 rounded-full font-plain text-label-large text-primary state-layer-flat focus-ring'
          }
        >
          <Icon name="add" className="w-5 h-5" />
          {!hasSections && 'Add section'}
        </button>
      </div>
    </section>
  );
}
