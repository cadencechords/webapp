import { countLines } from '../utils/SongUtils';
import type { Song } from '../types';

type EditorProps = {
  song?: Partial<Pick<Song, 'content' | 'format'>>;
  onContentChange: (content: string) => void;
};

export default function Editor({ song = {}, onContentChange }: EditorProps) {
  const { content, format } = song;
  const styles = {
    fontFamily: format?.font,
    fontSize: `${format?.font_size}px`,
  };

  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <textarea
        aria-label="Song content"
        className="w-full p-2 overflow-y-hidden bg-transparent rounded-large outline-hidden resize-none text-on-surface placeholder:text-on-surface-variant caret-primary focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
        value={content}
        onChange={e => onContentChange(e.target.value)}
        style={styles}
        rows={countLines(content) + 3}
        placeholder="Type your song here"
      ></textarea>
    </div>
  );
}
