import { getHalfStepHigher, getHalfStepLower, hasAnyKeysSet } from "../utils/SongUtils";
import { useDispatch, useSelector } from "react-redux";

import AdjustmentsIcon from "@heroicons/react/outline/AdjustmentsIcon";
import Button from "./Button";
import Drawer from "./Drawer";
import { EDIT_SONGS } from "../utils/constants";
import MinusIcon from "@heroicons/react/outline/MinusIcon";
import PencilIcon from "@heroicons/react/solid/PencilIcon";
import PlusIcon from "@heroicons/react/outline/PlusIcon";
import Toggle from "./Toggle";
import { selectCurrentMember } from "../store/authSlice";
import { setSongBeingEdited } from "../store/editorSlice";
import { useHistory } from "react-router-dom";
import { useState } from "react";

export default function PerformSetlistSongAdjustmentsDrawer({
	song,
	onFormatUpdate,
	onSongUpdate,
}) {
	const [open, setOpen] = useState(false);
	const currentMember = useSelector(selectCurrentMember);
	const dispatch = useDispatch();
	const router = useHistory();

	function handleTransposeUpHalfStep() {
		onSongUpdate("transposed_key", getHalfStepHigher(song.transposed_key || song.original_key));
	}

	function handleTransposeDownHalfStep() {
		onSongUpdate("transposed_key", getHalfStepLower(song.transposed_key || song.original_key));
	}

	function handleOpenInEditor() {
		dispatch(setSongBeingEdited(song));
		router.push("/editor");
	}

	return (
		<>
			<Button
				variant="open"
				color="gray"
				className="fixed right-3 bottom-28"
				onClick={() => setOpen(true)}
			>
				<AdjustmentsIcon className="w-6 h-6" />
			</Button>
			<Drawer open={open} onClose={() => setOpen(false)}>
				<div className="px-4 pt-8">
					<div className="flex-between mb-2">
						<div className="text-base font-semibold">Resize lyrics</div>
						<Toggle
							enabled={song.format.autosize}
							onChange={(newValue) => onFormatUpdate("autosize", newValue)}
						/>
					</div>
					<div className="flex-between mb-2">
						<div className="text-base font-semibold">Hide chords</div>
						<Toggle
							enabled={song.format.chords_hidden}
							onChange={(newValue) => onFormatUpdate("chords_hidden", newValue)}
						/>
					</div>
					<hr className="my-8" />
					<div className="flex-between mb-2">
						<div className="text-base font-semibold">Transpose</div>
						<Toggle
							enabled={song.show_transposed}
							onChange={(newValue) => onSongUpdate("show_transposed", newValue)}
						/>
					</div>
					{song.show_transposed && hasAnyKeysSet(song) && (
						<div className="flex-between p-2 rounded-md bg-gray-100">
							<Button variant="open" color="gray" onClick={handleTransposeUpHalfStep}>
								<PlusIcon className="w-5 h-5" />
							</Button>
							<div className="font-semibold text-xl">
								{song.transposed_key || song.original_key}
							</div>
							<Button variant="open" color="gray" onClick={handleTransposeDownHalfStep}>
								<MinusIcon className="w-5 h-5" />
							</Button>
						</div>
					)}
					{currentMember.can(EDIT_SONGS) && (
						<>
							<hr className="my-8" />
							<Button
								variant="outlined"
								color="black"
								full
								className="flex-center"
								onClick={handleOpenInEditor}
							>
								<PencilIcon className="w-4 h-4 text-blue-600 mr-2" />
								Edit
							</Button>
						</>
					)}
				</div>
			</Drawer>
		</>
	);
}
