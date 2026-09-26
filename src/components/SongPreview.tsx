import { html } from '../utils/SongUtils';

export default function SongPreview({ song }) {
  return (
    <div className="p-4 whitespace-pre-wrap border border-gray-300 rounded-md shadow-md resize-none dark:border-dark-gray-700">
      {html(song)}
    </div>
  );
}
