import { html } from '../utils/SongUtils';

export default function FormattedSong({ song }) {
  const format = { ...song.format };
  delete format.chords_hidden;

  return html({
    content: song.content,
    format,
  });
}
