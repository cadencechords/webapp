import { html } from "../utils/SongUtils";

export default function SongPreview({ song, onDoubleClick }) {
	return (
		<div
			className="rounded-md whitespace-pre-wrap resize-none shadow-md p-4 border border-gray-300"
			onDoubleClick={onDoubleClick}
		>
			{html(song)}
		</div>
	);
}
