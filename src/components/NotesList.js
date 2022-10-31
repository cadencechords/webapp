import Note from './Note';

export default function NotesList({
  song,
  onDelete,
  rearrangeable = true,
  onUpdate,
  onDragStart,
  onDragEnd,
}) {
  return song.notes?.map(note => (
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
  ));
}
