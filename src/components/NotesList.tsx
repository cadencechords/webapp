import Note from './Note';
import type { Song, SongNote } from '../types';

type NotesListProps = {
  song: Song;
  onDelete: (noteId: number) => void;
  rearrangeable?: boolean;
  onUpdate?: (noteId: number, updates: Partial<SongNote>) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

export default function NotesList({
  song,
  onDelete,
  rearrangeable = true,
  onUpdate,
  onDragStart,
  onDragEnd,
}: NotesListProps) {
  // Both callers render this only when song.notes is non-empty.
  return (
    <>
      {song.notes?.map(note => (
        <Note
          note={note}
          key={note.id}
          songId={song.id}
          onDelete={onDelete}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          isDragDisabled={!rearrangeable}
          onUpdate={onUpdate}
        />
      ))}
    </>
  );
}
