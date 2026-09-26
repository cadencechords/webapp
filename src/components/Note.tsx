import { useCallback, useState } from 'react';

import Draggable from 'react-draggable';
import type {
  ControlPosition,
  DraggableData,
  DraggableEvent,
} from 'react-draggable';
import NoteDialog from '../dialogs/NoteDialog';
import type { NoteUpdates } from '../dialogs/NoteDialog';
import NotesApi from '../api/notesApi';
import _ from 'lodash';
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

  // oxlint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce(async (content: string) => {
      try {
        NotesApi.update(songId, note.id, { content });
        onUpdate?.({ content });
      } catch (error) {
        reportError(error);
      }
    }, 1200),
    [songId, note.id]
  );

  function handleContentChange(newContent: string) {
    setContent(newContent);
    debounce(newContent);
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
        <div className="absolute z-20 flex w-56 shadow-md">
          <textarea
            className={
              `w-full p-2 rounded-none resize-none h-full outline-hidden focus:outline-hidden text-base md:text-sm text-black dark:text-black` +
              ` ${NOTE_COLORS[color].main}`
            }
            value={content}
            onChange={e => handleContentChange(e.target.value)}
            rows={numberOfLines < 2 ? 2 : numberOfLines}
            placeholder="Type here"
          ></textarea>
          <div className={`w-9 ${NOTE_COLORS[color].side}`}>
            <button
              className="w-full py-1 outline-hidden focus:outline-hidden flex-center"
              onClick={() => setShowDialog(true)}
            >
              <Icon
                name="settings"
                className={`w-5 h-5 ${NOTE_COLORS[color].icon}`}
              />
            </button>

            <div className="w-full h-full handle"></div>
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

type NoteColorClasses = { main: string; side: string; icon: string };

// Looked up by the note's color; one of these four in practice.
const NOTE_COLORS: Record<string, NoteColorClasses> = {
  blue: {
    main: 'bg-blue-200 dark:bg-blue-300 placeholder-blue-700',
    side: 'bg-blue-300 dark:bg-blue-400',
    icon: 'text-blue-900',
  },
  green: {
    main: 'bg-green-200 dark:bg-green-300 placeholder-green-700',
    side: 'bg-green-300 dark:bg-green-400',
    icon: 'text-green-900',
  },
  yellow: {
    main: 'bg-yellow-200 dark:bg-yellow-200 placeholder-yellow-700',
    side: 'bg-yellow-300',
    icon: 'text-yellow-900',
  },
  pink: {
    main: 'bg-pink-200 dark:bg-pink-300 placeholder-pink-700',
    side: 'bg-pink-300 dark:bg-pink-400',
    icon: 'text-pink-900',
  },
};
