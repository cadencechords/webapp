import CapoOption from "./CapoOption";
import { determineCapos } from "../utils/capo";

export default function CapoOptions({ onCapoChange, song, onRemoveCapo }) {
	const { commonKeys: commonCapos, uncommonKeys: otherCapos } = determineCapos(
		(song.show_transposed && song.transposed_key) || song.original_key
	);

	return (
		<div className="flex items-center overflow-x-auto scrollbar-thin pb-3 scrollbar-thumb-gray-300 scrollbar-track-gray-100">
			<CapoOption
				capoKey="None"
				capoNumber="0"
				className="mr-4"
				onClick={onRemoveCapo}
				selected={!song.capo}
			/>
			{commonCapos.map((capoOption) => (
				<CapoOption
					key={capoOption.capoKey}
					capoKey={capoOption.capoKey}
					capoNumber={capoOption.capoNumber}
					className="mr-4"
					onClick={onCapoChange}
					selected={song.capo?.capo_key === capoOption.capoKey}
				/>
			))}
			{otherCapos.map((capoOption) => (
				<CapoOption
					key={capoOption.capoKey}
					capoKey={capoOption.capoKey}
					capoNumber={capoOption.capoNumber}
					className="mr-4"
					onClick={onCapoChange}
					selected={song.capo?.capo_key === capoOption.capoKey}
				/>
			))}
		</div>
	);
}
