import { useState } from 'react';

import Draggable from 'react-draggable';
import type {
  ControlPosition,
  DraggableData,
  DraggableEvent,
} from 'react-draggable';
import NoteDialog from '../dialogs/NoteDialog';
import type { NoteUpdates } from '../dialogs/NoteDialog';
import NotesApi from '../api/notesApi';
import useDebouncedCallback from '../hooks/useDebouncedCallback';
import { reportError } from '../utils/error';
import Icon from './Icon';
import type { SongNote } from '../types';

/**
 * Called as `(noteId, updates)` after a drag or a dialog edit, but the
 * debounced content save calls it as `({ content })`, without the id. No
 * caller passes `onUpdate` yet, so the mismatch is kept as it was.
 */
export type NoteUpdateHandler = (
  ...args:
    | [noteId: number, updates: Partial<Omit<SongNote, 'id'>>]
    | [updates: { content: string }]
) => void;

type NoteProps = {
  songId: number;
  note: SongNote;
  /** Called with the note's id; the note is deleted from the API too. */
  onDelete: (noteId: number) => void;
  isDragDisabled?: boolean;
  onUpdate?: NoteUpdateHandler;
  onDragEnd?: () => void;
  onDragStart?: () => void;
};

export default function Note({
  songId,
  note,
  onDelete,
  isDragDisabled,
  onUpdate,
  onDragEnd,
  onDragStart,
}: NoteProps) {
  const [content, setContent] = useState(note.content || '');
  const [color, setColor] = useState(note.color || '');
  const [showDialog, setShowDialog] = useState(false);

  const numberOfLines = content?.split(/\r\n|\r|\n/).length;

  function handleUpdatesFromDialog(updates: NoteUpdates) {
    if (updates.color) setColor(updates.color);
    if (updates.content) setContent(updates.content);
    handleSaveUpdates(updates);
    onUpdate?.(note.id, updates);
  }

  function handleDragStop(e: DraggableEvent, data: DraggableData) {
    onDragEnd?.();
    handleSaveUpdates({ x: data.x, y: data.y });
    onUpdate?.(note.id, { x: data.x, y: data.y });
  }

  function handleSaveUpdates(updates: Partial<Omit<SongNote, 'id'>>) {
    try {
      NotesApi.update(songId, note.id, updates);
    } catch (error) {
      reportError(error);
    }
  }

  function handleDelete() {
    onDelete(note.id);
    try {
      NotesApi.delete(songId, note.id);
    } catch (error) {
      reportError(error);
    }
  }

  // The ids are passed in, so a waiting save goes to the note it was typed in.
  const debounce = useDebouncedCallback(
    (songIdToSave: number, noteId: number, content: string) => {
      try {
        NotesApi.update(songIdToSave, noteId, { content });
        onUpdate?.({ content });
      } catch (error) {
        reportError(error);
      }
    },
    1200,
    'flush'
  );

  function handleContentChange(newContent: string) {
    setContent(newContent);
    debounce(songId, note.id, newContent);
  }

  return (
    <>
      <Draggable
        disabled={isDragDisabled}
        handle=".handle"
        // `as ControlPosition`: assumes the API sends every note's saved x/y
        // (SongNote leaves them optional). A note without them passes
        // undefined to react-draggable, as the JS did.
        defaultPosition={{ x: note.x, y: note.y } as ControlPosition}
        bounds="parent"
        onStop={handleDragStop}
        onStart={onDragStart}
      >
        {/* A sticky note in its user color: the text on the container
            tone, and a strip in the color itself holding the edit button
            over the drag handle. */}
        <div className="absolute z-20 flex w-56 overflow-hidden rounded-medium">
          <textarea
            className={
              `w-full h-full p-3 bg-transparent resize-none outline-hidden focus:outline-hidden font-plain text-body-large md:text-body-medium` +
              ` ${noteColorClasses(color).main}`
            }
            value={content}
            onChange={e => handleContentChange(e.target.value)}
            rows={numberOfLines < 2 ? 2 : numberOfLines}
            placeholder="Type here"
          ></textarea>
          <div className={`flex flex-col w-9 ${noteColorClasses(color).side}`}>
            <button
              type="button"
              aria-label="Edit note"
              className="w-full py-1.5 flex-center state-layer-flat focus-ring"
              onClick={() => setShowDialog(true)}
            >
              <Icon name="edit" className="w-5 h-5" />
            </button>

            <div
              className="flex-1 w-full pt-1 flex justify-center cursor-grab handle"
              title="Drag to move"
            >
              <Icon name="drag_indicator" className="w-5 h-5 opacity-70" />
            </div>
          </div>
        </div>
      </Draggable>

      <NoteDialog
        open={showDialog}
        onCloseDialog={() => setShowDialog(false)}
        note={{ content: content, color: color }}
        onUpdate={handleUpdatesFromDialog}
        onDelete={handleDelete}
      />
    </>
  );
}

type NoteColorClasses = { main: string; side: string };

/** A note color's classes: the text on its container tone, and the strip in
    the color itself. One of these four in practice; blue without one. */
export function noteColorClasses(color: string | undefined): NoteColorClasses {
  return NOTE_COLORS[color || ''] ?? NOTE_COLORS.blue!;
}

// The note colors, as the user colors (src/utils/userColors.ts).
const NOTE_COLORS: Record<string, NoteColorClasses> = {
  blue: {
    main: 'bg-user-blue-container text-on-user-blue-container placeholder:text-on-user-blue-container/60',
    side: 'bg-user-blue text-on-user-blue',
  },
  green: {
    main: 'bg-user-green-container text-on-user-green-container placeholder:text-on-user-green-container/60',
    side: 'bg-user-green text-on-user-green',
  },
  yellow: {
    main: 'bg-user-yellow-container text-on-user-yellow-container placeholder:text-on-user-yellow-container/60',
    side: 'bg-user-yellow text-on-user-yellow',
  },
  pink: {
    main: 'bg-user-pink-container text-on-user-pink-container placeholder:text-on-user-pink-container/60',
    side: 'bg-user-pink text-on-user-pink',
  },
};
