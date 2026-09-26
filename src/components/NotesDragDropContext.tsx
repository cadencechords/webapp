import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import Note from './Note';
import _ from 'lodash';
import { countLines } from '../utils/SongUtils';
import { max } from '../utils/numberUtils';
import notesApi from '../api/notesApi';
import { reportError } from '../utils/error';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import type { Song, SongNote } from '../types';

type NoteUpdates = Partial<Omit<SongNote, 'id'>>;

type NotesDragDropContextProps = {
  song: Song;
  onAddTempNote: (note: SongNote) => void;
  onReplaceTempNote: (tempId: number, note: SongNote) => void;
  onUpdateNote: (noteId: number, updates: NoteUpdates) => void;
  onDeleteNote: (noteId: number) => void;
  rearrangable?: boolean;
};

type DragResult = {
  source: { index: number };
  destination?: { index: number } | null;
};

export default function NotesDragDropContext({
  song,
  onAddTempNote,
  onReplaceTempNote,
  onUpdateNote,
  onDeleteNote,
  rearrangable = true,
}: NotesDragDropContextProps) {
  const [lineCount] = useState(() => {
    let highestLineNumber = 0;
    song.notes?.forEach(note => {
      if (note.line_number > highestLineNumber)
        highestLineNumber = note.line_number;
    });

    return max(highestLineNumber, countLines(song.content));
  });

  const [lines, setLines] = useState<(SongNote | null)[]>(
    new Array(lineCount).fill(null)
  );

  useEffect(() => {
    const newLines: (SongNote | null)[] = new Array(lineCount).fill(null);
    song.notes?.forEach(note => (newLines[note.line_number] = note));
    setLines(newLines);
  }, [song, lineCount]);

  function handleDragEnd({ source, destination }: DragResult) {
    if (!destination) return;

    // Only notes are draggable (empty lines have isDragDisabled), so the
    // source line always holds a note.
    const noteBeingUpdated = lines[source.index] as SongNote;
    handleUpdateNote(noteBeingUpdated, { line_number: destination.index });
    setLines(currentLines =>
      reorder(currentLines, source.index, destination.index)
    );
  }

  async function handleAddNewNote(lineNumber: number) {
    const tempId = Math.random();
    const note = {
      id: tempId,
      content: '',
      color: 'yellow',
      line_number: lineNumber,
    };

    onAddTempNote(note);

    try {
      // Known bug, kept as is: the arguments are swapped, so this posts to
      // /songs/<line number>/notes with the song id as the body. The cast only
      // keeps that call type-checking. Nothing renders NotesDragDropContext;
      // it's slated for deletion.
      const { data } = await notesApi.create(
        lineNumber,
        song.id as unknown as Parameters<typeof notesApi.create>[1]
      );
      onReplaceTempNote(tempId, data);
    } catch (error) {
      reportError(error);
    }
  }

  function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  function getNotesColumnStyles(snapshot: { isDraggingOver: boolean }) {
    return snapshot.isDraggingOver
      ? 'bg-gray-100 dark:bg-dark-gray-700'
      : 'bg-white dark:bg-dark-gray-900';
  }

  function handleUpdateNote(note: SongNote, updates: NoteUpdates) {
    setLines(currentLines => {
      const updatedLines = currentLines.map((line, index) =>
        index === note.line_number ? { ...note, ...updates } : line
      );
      return updatedLines;
    });
    onUpdateNote(note.id, updates);
    debounce(note.id, updates);
  }

  // eslint-disable-next-line
  const debounce = useCallback(
    _.debounce((noteId: number, updates: NoteUpdates) => {
      try {
        notesApi.update(song.id, noteId, updates);
      } catch (error) {
        reportError(error);
      }
    }, 1200),
    []
  );

  async function handleDelete(noteId: number) {
    onDeleteNote(noteId);
    try {
      await notesApi.delete(song.id, noteId);
    } catch (error) {
      reportError(error);
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`md:px-1 transition-colors ${getNotesColumnStyles(snapshot)}`}
          >
            {lines.map((line, index) =>
              line ? (
                <Note
                  note={line}
                  key={index}
                  onUpdate={handleUpdateNote}
                  onDelete={handleDelete}
                  isDragDisabled={!rearrangable}
                />
              ) : (
                <Draggable
                  key={index}
                  draggableId={`${index}`}
                  index={index}
                  isDragDisabled
                >
                  {provided => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      onDoubleClick={() => handleAddNewNote(index)}
                    >
                      <span
                        style={{
                          fontFamily: song.format.font,
                          fontSize: `${song.format.font_size}px`,
                        }}
                        className="select-none"
                      >
                        &nbsp;
                      </span>
                    </div>
                  )}
                </Draggable>
              )
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
