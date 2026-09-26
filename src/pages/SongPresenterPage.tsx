import {
  adjustSongBeingPresented,
  selectSongBeingPresented,
} from '../store/presenterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import NotesList from '../components/NotesList';
import Roadmap from '../components/Roadmap';
import SongAdjustmentsDrawer from '../components/SongAdjustmentsDrawer';
import SongPresenterBottomSheet from '../components/SongPresenterBottomSheet';
import SongPresenterTopBar from '../components/SongPresenterTopBar';
import { html } from '../utils/SongUtils';
import notesApi from '../api/notesApi';
import { reportError } from '../utils/error';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import { useCurrentUser } from '../hooks/api/currentUser.hooks';
import AddMarkingsModal from '../components/AddMarkingsModal';
import Marking from '../components/Marking';
import Annotations from '../components/Annotations';
import AnnotationsToolbar from '../components/AnnotationsToolbar';
import usePerformanceMode from '../hooks/usePerformanceMode';
import classNames from 'classnames';
import type { RefObject } from 'react';
import type { PresentedSong } from '../store/presenterSlice';
import type { SongPresenterSheet } from '../components/SongPresenterBottomSheet';
import type { Marking as MarkingModel, Song, SongFormat } from '../types';

export default function SongPresenterPage() {
  // The route's path declares :id, which useParams can't see.
  const id = useParams<{ id: string }>().id;
  const song = useSelector(selectSongBeingPresented);
  const { isAnnotating } = usePerformanceMode();
  const dispatch = useDispatch();
  const currentSubscription = useSelector(selectCurrentSubscription);
  const pageRef = useRef<HTMLDivElement>();
  const [isAddMarkingsVisible, setIsAddMarkingsVisible] = useState(false);
  const [bottomSheet, setBottomSheet] = useState<SongPresenterSheet>();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const { data: currentUser } = useCurrentUser({
    refetchOnWindowFocus: false,
    onSuccess: ({ format_preferences }) => {
      dispatch(
        adjustSongBeingPresented({
          format: {
            ...song.format,
            // Non-null: kept as before, this throws for a user without
            // format preferences.
            chords_hidden: format_preferences!.hide_chords,
          },
        })
      );
    },
  });

  const [showOptionsDrawer, setShowOptionsDrawer] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener('gesturestart', handler);
    document.addEventListener('gesturechange', handler);
    document.addEventListener('gestureend', handler);
    return () => {
      document.removeEventListener('gesturestart', handler);
      document.removeEventListener('gesturechange', handler);
      document.removeEventListener('gestureend', handler);
    };
  }, []);

  function handleFormatChange(field: keyof SongFormat, value: boolean) {
    const updatedFormat = { ...song.format, [field]: value };
    dispatch(adjustSongBeingPresented({ format: updatedFormat }));
  }

  // SongAdjustmentsDrawer passes any of the song's fields, with its value.
  function handleSongChange(field: keyof Song, value: unknown) {
    dispatch(adjustSongBeingPresented({ [field]: value }));
  }

  function handleDeleteNote(noteIdToDelete: number) {
    // Non-null: NotesList renders only for a song with notes.
    const filteredNotes = song.notes!.filter(
      note => note.id !== noteIdToDelete
    );
    dispatch(adjustSongBeingPresented({ notes: filteredNotes }));
  }

  function handleMarkingDeleted(deletedId: number) {
    // Non-null: markings render only for a song with markings.
    const filteredMarkings = song.markings!.filter(
      marking => marking.id !== deletedId
    );
    dispatch(adjustSongBeingPresented({ markings: filteredMarkings }));
  }

  async function handleAddNote() {
    try {
      // Non-null (both): kept as before. The page renders, and so offers
      // this, only with a whole song on screen; one without notes throws.
      const { data } = await notesApi.create(song.id!);
      dispatch(adjustSongBeingPresented({ notes: [...song.notes!, data] }));
      setShowOptionsDrawer(false);
    } catch (error) {
      reportError(error);
    }
  }

  function handleMarkingAdded(marking: MarkingModel) {
    // Non-null: kept as before, this throws for a song without markings.
    const markings = [...song.markings!, marking];
    dispatch(adjustSongBeingPresented({ markings }));
  }

  function handleShowBottomSheet(sheet: SongPresenterSheet) {
    setShowBottomSheet(true);
    setShowOptionsDrawer(false);
    setBottomSheet(sheet);
  }

  function handleToggleRoadmap() {
    dispatch(adjustSongBeingPresented({ show_roadmap: !song.show_roadmap }));
  }

  function handleUpdateSong(updates: Partial<PresentedSong>) {
    dispatch(adjustSongBeingPresented(updates));
  }

  if (song && song.format && currentUser) {
    // `as PresentedSong` below: SongDetailPage stores a whole song before it
    // opens this page, so a stored song with a format is a whole one.
    return (
      <div
        // `as`: React only writes this ref (it starts undefined, as before,
        // and holds the div once mounted); nothing reads it.
        ref={pageRef as RefObject<HTMLDivElement>}
        id="page"
      >
        <SongPresenterTopBar
          song={song as PresentedSong}
          onShowOptionsDrawer={() => setShowOptionsDrawer(true)}
          onAddNote={handleAddNote}
          onUpdateSong={handleUpdateSong}
          onShowMarkingsModal={() => setIsAddMarkingsVisible(true)}
        />

        <div
          className={classNames(
            'max-w-6xl p-3 mx-auto',
            isAnnotating && 'select-none'
          )}
        >
          <Roadmap
            song={song as PresentedSong}
            onSongChange={handleSongChange}
            onToggleRoadmap={handleToggleRoadmap}
          />
          <div className="relative w-full">
            {/* `song.notes &&`: the same as before, `undefined > 0` is false. */}
            {currentSubscription?.isPro &&
              song.notes &&
              song.notes.length > 0 && (
                <NotesList
                  song={song as PresentedSong}
                  onDelete={handleDeleteNote}
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
            {currentSubscription?.isPro && song.annotations && (
              <Annotations
                // `as`: Annotations is still JavaScript, and TypeScript
                // infers never[] from its `= []` default. It takes the song's
                // annotation paths.
                annotations={song.annotations as never[]}
              />
            )}
            <div id="song" className="relative mr-0">
              {html(song as PresentedSong)}
            </div>
          </div>
        </div>

        <SongAdjustmentsDrawer
          open={showOptionsDrawer}
          onClose={() => setShowOptionsDrawer(false)}
          song={song as PresentedSong}
          onFormatChange={handleFormatChange}
          onSongChange={handleSongChange}
          onAddNote={handleAddNote}
          onShowSheet={handleShowBottomSheet}
        />

        <SongPresenterBottomSheet
          sheet={bottomSheet}
          open={showBottomSheet}
          onClose={() => setShowBottomSheet(false)}
          song={song as PresentedSong}
          onSongChange={handleSongChange}
        />

        {currentSubscription?.isPro && <AnnotationsToolbar />}
        {currentSubscription?.isPro && (
          <AddMarkingsModal
            open={isAddMarkingsVisible}
            onClose={() => setIsAddMarkingsVisible(false)}
            onMarkingAdded={handleMarkingAdded}
            song={song}
          />
        )}
      </div>
    );
  } else {
    return <Redirect to={`/songs/${id}`} />;
  }
}
