import { toHtml } from "../utils/SongUtils";

export default function SongPreview({ song }) {
	let formatStyles = { fontFamily: song.font, fontSize: song.font_size };

	return (
		<div
			className="rounded-md whitespace-pre-wrap resize-none shadow-md p-4 border border-gray-300"
			style={formatStyles}
		>
			{toHtml(song.content, {
				boldChords: song.bold_chords,
				italicChords: song.italic_chords,
				showChordsDisabled: song.showChordsDisabled,
			})}
		</div>
	);
}
