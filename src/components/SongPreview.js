import { hasAnyKeysSet, html } from "../utils/SongUtils";

import { determineFret } from "../utils/capo";

export default function SongPreview({ song, onDoubleClick }) {
	return (
		<div
			className="rounded-md whitespace-pre-wrap resize-none shadow-md p-4 border border-gray-300"
			onDoubleClick={onDoubleClick}
		>
			{hasAnyKeysSet(song) && song.capo && (
				<p className="font-medium mb-4">
					Capo:
					<span className="ml-2">
						{determineFret(
							(song.show_transposed && song.transposed_key) || song.original_key,
							song.capo.capo_key
						)}
					</span>
				</p>
			)}
			{html(song)}
		</div>
	);
}
