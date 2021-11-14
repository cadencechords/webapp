import { getHalfStepHigher, getHalfStepLower } from "../utils/music";

import Button from "./Button";
import MinusIcon from "@heroicons/react/outline/MinusIcon";
import OrDivider from "./OrDivider";
import PlusIcon from "@heroicons/react/outline/PlusIcon";
import SectionTitle from "./SectionTitle";
import Toggle from "./Toggle";
import TransposeOptions from "./TransposeOptions";
import { hasAnyKeysSet } from "../utils/SongUtils";

export default function SongPresenterTransposeSheet({ song, onSongChange }) {
	function handleTransposeUpHalfStep() {
		onSongChange("transposed_key", getHalfStepHigher(song.transposed_key || song.original_key));
	}

	function handleTransposeDownHalfStep() {
		onSongChange("transposed_key", getHalfStepLower(song.transposed_key || song.original_key));
	}

	return (
		<div className="p-1">
			<SectionTitle
				title={
					<>
						Transpose{" "}
						<Toggle
							enabled={song.show_transposed}
							onChange={(value) => onSongChange("show_transposed", value)}
						/>
					</>
				}
				className="pb-2 flex items-center"
			/>

			{song.show_transposed && hasAnyKeysSet(song) && (
				<div>
					<div className="flex-between p-2  bg-gray-100 mt-4 w-56 mx-auto">
						<Button variant="open" color="gray" onClick={handleTransposeUpHalfStep}>
							<PlusIcon className="w-5 h-5" />
						</Button>
						<div className="font-semibold text-xl">{song.transposed_key || song.original_key}</div>
						<Button variant="open" color="gray" onClick={handleTransposeDownHalfStep}>
							<MinusIcon className="w-5 h-5" />
						</Button>
					</div>
					<OrDivider />
					<TransposeOptions
						song={song}
						onKeyChange={(newKey) => onSongChange("transposed_key", newKey)}
					/>
				</div>
			)}
		</div>
	);
}
