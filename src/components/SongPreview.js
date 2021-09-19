import { toHtml, transpose as transposeSong } from "../utils/SongUtils";

export default function SongPreview({ song, transpose }) {
	let formatStyles = { fontFamily: song.format.font, fontSize: song.format.font_size };

	let content = song.content;

	if (song.transposed_key && song.original_key && transpose) {
		content = transposeSong(song);
	}
	console.log(`Show chords disabled: ${song.showChordsDisabled}`);

	return (
		<div
			className="rounded-md whitespace-pre-wrap resize-none shadow-md p-4 border border-gray-300"
			style={formatStyles}
		>
			{toHtml(content, {
				boldChords: song.format.bold_chords,
				italicChords: song.format.italic_chords,
				showChordsDisabled: song.showChordsDisabled,
			})}
		</div>
	);
}
