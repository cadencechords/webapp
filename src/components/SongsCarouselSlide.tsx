import { useState } from 'react';

import NotesList from './NotesList';
import Roadmap from './Roadmap';
import useDebouncedCallback from '../hooks/useDebouncedCallback';
import { html } from '../utils/SongUtils';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import { useSelector } from 'react-redux';
import Marking from './Marking';
import Annotations from './Annotations';
import type { PresentedSong } from '../store/presenterSlice';

type SongsCarouselSlideProps = {
  song: PresentedSong;
  onDisableSwipe: () => void;
  onEnableSwipe: () => void;
  onSongUpdate: <K extends 'roadmap' | 'notes' | 'markings'>(
    field: K,
    value: PresentedSong[K]
  ) => void;
};

export default function SongsCarouselSlide({
  song,
  onDisableSwipe,
  onEnableSwipe,
  onSongUpdate,
}: SongsCarouselSlideProps) {
  const currentSubscription = useSelector(selectCurrentSubscription);
  const [roadmap, setRoadmap] = useState(() => song.roadmap);
  const [notes, setNotes] = useState(() => song.notes);

  // Each call passes the onSongUpdate of its own render. SetPresenterPage's
  // updates the song being viewed when it runs, so the latest one would put
  // an edit on another song if the viewed song changed during the wait.
  const debounce = useDebouncedCallback(
    <K extends 'roadmap' | 'notes'>(
      update: typeof onSongUpdate,
      field: K,
      updatedValue: PresentedSong[K]
    ) => {
      update(field, updatedValue);
    },
    200,
    'flush'
  );

  function handleRoadmapUpdate(field: 'roadmap', updatedRoadmap: string[]) {
    setRoadmap(updatedRoadmap);
    debounce(onSongUpdate, 'roadmap', updatedRoadmap);
  }

  function onDeleteNote(noteId: number) {
    const updatedNotes = notes?.filter(note => note.id !== noteId);

    setNotes(updatedNotes);
    debounce(onSongUpdate, 'notes', updatedNotes);
  }

  function handleMarkingDeleted(deletedId: number) {
    const updatedMarkings = song.markings?.filter(
      marking => marking.id !== deletedId
    );
    onSongUpdate('markings', updatedMarkings);
  }

  return (
    <div key={song?.id} className="block mb-4">
      <Roadmap
        song={{ id: song.id, roadmap: roadmap }}
        onSongChange={handleRoadmapUpdate}
        onDragEnd={onEnableSwipe}
        onDragStart={onDisableSwipe}
      />
      <div className="relative w-full overflow-x-hidden">
        {/* `song.notes &&`: the same as before, `undefined > 0` is false. */}
        {currentSubscription?.isPro && song.notes && song.notes.length > 0 && (
          <NotesList
            rearrangeable={true}
            song={song}
            onDelete={onDeleteNote}
            onDragEnd={onEnableSwipe}
            onDragStart={onDisableSwipe}
          />
        )}
        {currentSubscription?.isPro &&
          song.markings &&
          song.markings.length > 0 &&
          song.markings.map(marking => (
            <Marking
              marking={marking}
              key={marking.id}
              song={song}
              onDeleted={handleMarkingDeleted}
            />
          ))}
        {currentSubscription?.isPro && (
          <Annotations annotations={song.annotations} />
        )}
        <div id="song" className="pb-24 mr-0">
          {html(song)}
        </div>
      </div>
    </div>
  );
}
