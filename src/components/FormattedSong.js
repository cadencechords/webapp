import { html } from '../utils/SongUtils';

export default function FormattedSong({ song }) {
  return html({
    content: song.content,
    format: song.format,
  });
}
