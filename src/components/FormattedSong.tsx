import type { Song } from '../types';
import { html } from '../utils/SongUtils';

interface FormattedSongProps {
  song: Pick<Song, 'content' | 'format'>;
}

export default function FormattedSong({ song }: FormattedSongProps) {
  const format = { ...song.format };
  delete format.chords_hidden;

  // `html` returns '' when the song has no content or format. The unkeyed
  // fragment only satisfies the JSX return type: React unwraps an unkeyed
  // top-level fragment returned by a component, so it renders exactly `html`'s
  // result.
  return (
    <>
      {html({
        content: song.content,
        format,
      })}
    </>
  );
}
