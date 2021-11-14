import { MAJOR_KEYS, MINOR_KEYS } from "../utils/music";

import TransposeOption from "./TransposeOption";
import { isMinor } from "../utils/SongUtils";
import { useState } from "react";

export default function TransposeOptions({ song, onKeyChange }) {
	const [keys] = useState(
		isMinor(song.transposed_key || song.original_key) ? MINOR_KEYS : MAJOR_KEYS
	);

	return (
		<div className="flex items-center overflow-x-auto scrollbar-thin pb-3 scrollbar-thumb-gray-300 scrollbar-track-gray-100">
			{keys.map((key) => (
				<TransposeOption
					key={key}
					className="mr-4"
					selected={key === song.transposed_key}
					onClick={() => onKeyChange(key)}
				>
					{key}
				</TransposeOption>
			))}
		</div>
	);
}
