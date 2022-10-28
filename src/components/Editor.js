import { countLines } from '../utils/SongUtils';

export default function Editor({ song = {}, onContentChange }) {
  const { content, format } = song;
  const styles = {
    fontFamily: format?.font,
    fontSize: `${format?.font_size}px`,
  };

  return (
    <div className="my-3 overflow-x-auto overflow-y-hidden">
      <textarea
        className="w-full p-2 overflow-y-hidden transition-colors bg-transparent outline-none resize-none hover:bg-gray-100 focus:outline-none dark:hover:bg-dark-gray-700"
        value={content}
        onChange={e => onContentChange(e.target.value)}
        style={styles}
        rows={countLines(content) + 3}
        placeholder="Type your song here"
      ></textarea>
    </div>
  );
}
