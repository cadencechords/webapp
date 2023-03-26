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

export default function SongPresenterPage() {
  const id = useParams().id;
  const song = useSelector(selectSongBeingPresented);
  const dispatch = useDispatch();
  const currentSubscription = useSelector(selectCurrentSubscription);
  const pageRef = useRef();
  const [isAddMarkingsVisible, setIsAddMarkingsVisible] = useState(false);
  const [bottomSheet, setBottomSheet] = useState();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const { data: currentUser } = useCurrentUser({
    refetchOnWindowFocus: false,
    onSuccess: ({ format_preferences }) => {
      dispatch(
        adjustSongBeingPresented({
          format: {
            ...song.format,
            chords_hidden: format_preferences.hide_chords,
          },
        })
      );
    },
  });

  const [showOptionsDrawer, setShowOptionsDrawer] = useState(false);

  useEffect(() => {
    const handler = e => e.preventDefault();
    document.addEventListener('gesturestart', handler);
    document.addEventListener('gesturechange', handler);
    document.addEventListener('gestureend', handler);
    return () => {
      document.removeEventListener('gesturestart', handler);
      document.removeEventListener('gesturechange', handler);
      document.removeEventListener('gestureend', handler);
    };
  }, []);

  function handleFormatChange(field, value) {
    let updatedFormat = { ...song.format, [field]: value };
    dispatch(adjustSongBeingPresented({ format: updatedFormat }));
  }

  function handleSongChange(field, value) {
    dispatch(adjustSongBeingPresented({ [field]: value }));
  }

  function handleDeleteNote(noteIdToDelete) {
    let filteredNotes = song.notes.filter(note => note.id !== noteIdToDelete);
    dispatch(adjustSongBeingPresented({ notes: filteredNotes }));
  }

  function handleMarkingDeleted(deletedId) {
    const filteredMarkings = song.markings.filter(
      marking => marking.id !== deletedId
    );
    dispatch(adjustSongBeingPresented({ markings: filteredMarkings }));
  }

  async function handleAddNote() {
    try {
      let { data } = await notesApi.create(song.id);
      dispatch(adjustSongBeingPresented({ notes: [...song.notes, data] }));
      setShowOptionsDrawer(false);
    } catch (error) {
      reportError(error);
    }
  }

  function handleMarkingAdded(marking) {
    const markings = [...song.markings, marking];
    dispatch(adjustSongBeingPresented({ markings }));
  }

  function handleShowBottomSheet(sheet) {
    setShowBottomSheet(true);
    setShowOptionsDrawer(false);
    setBottomSheet(sheet);
  }

  function handleToggleRoadmap() {
    dispatch(adjustSongBeingPresented({ show_roadmap: !song.show_roadmap }));
  }

  function handleUpdateSong(updates) {
    dispatch(adjustSongBeingPresented(updates));
  }

  if (song && song.format && currentUser) {
    return (
      <div ref={pageRef} id="page">
        <SongPresenterTopBar
          song={song}
          onShowOptionsDrawer={() => setShowOptionsDrawer(true)}
          onAddNote={handleAddNote}
          onUpdateSong={handleUpdateSong}
          onShowMarkingsModal={() => setIsAddMarkingsVisible(true)}
        />

        <div className="max-w-6xl p-3 mx-auto">
          <Roadmap
            song={song}
            onSongChange={handleSongChange}
            onToggleRoadmap={handleToggleRoadmap}
          />
          <div className="relative w-full">
            {currentSubscription?.isPro && song.notes?.length > 0 && (
              <NotesList song={song} onDelete={handleDeleteNote} />
            )}
            {currentSubscription?.isPro &&
              song.markings?.length > 0 &&
              song.markings.map(marking => (
                <Marking
                  marking={marking}
                  key={marking.id}
                  song={song}
                  onDeleted={handleMarkingDeleted}
                />
              ))}
            <div id="song" className="mr-0">
              {html(song)}
            </div>
          </div>
        </div>

        <SongAdjustmentsDrawer
          open={showOptionsDrawer}
          onClose={() => setShowOptionsDrawer(false)}
          song={song}
          onFormatChange={handleFormatChange}
          onSongChange={handleSongChange}
          onAddNote={handleAddNote}
          onShowSheet={handleShowBottomSheet}
        />

        <SongPresenterBottomSheet
          sheet={bottomSheet}
          open={showBottomSheet}
          onClose={() => setShowBottomSheet(false)}
          song={song}
          onSongChange={handleSongChange}
        />
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
