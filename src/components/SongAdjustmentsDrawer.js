import { getHalfStepHigher, getHalfStepLower, hasAnyKeysSet } from "../utils/songUtils";

import Button from "./Button";
import Drawer from "./Drawer";
import { EDIT_SONGS } from "../utils/constants";
import MinusIcon from "@heroicons/react/outline/MinusIcon";
import PlusIcon from "@heroicons/react/outline/PlusIcon";
import SongApi from "../api/SongApi";
import Toggle from "./Toggle";
import { selectCurrentMember } from "../store/authSlice";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function SongAdjustmentsDrawer({
	open,
	onClose,
	song,
	onAdjustmentMade,
	onToggleTranspose,
	transposing,
}) {
	const [updates, setUpdates] = useState();
	const [saving, setSaving] = useState(false);
	const currentMember = useSelector(selectCurrentMember);
	const id = useParams().id;
	const handleAdjustmentMade = (adjustmentField, adjustmentValue) => {
		if (adjustmentField === "showChordsDisabled") {
			localStorage.setItem(`show_chords_disabled_song_${song.id}`, adjustmentValue);
		}

		onAdjustmentMade(adjustmentField, adjustmentValue);
	};

	const handleTransposeUpHalfStep = () => {
		let updatedKey = getHalfStepHigher(song.transposed_key || song.original_key);
		setUpdates((currentUpdates) => ({ ...currentUpdates, transposed_key: updatedKey }));
		onAdjustmentMade("transposed_key", updatedKey);
	};

	const handleTransposeDownHalfStep = () => {
		let updatedKey = getHalfStepLower(song.transposed_key || song.original_key);
		setUpdates((currentUpdates) => ({ ...currentUpdates, transposed_key: updatedKey }));
		onAdjustmentMade("transposed_key", updatedKey);
	};

	const handleSaveUpdates = async () => {
		try {
			setSaving(true);
			await SongApi.updateOneById(id, updates);
			setUpdates(null);
		} catch (error) {
			console.log(error);
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			<Drawer open={open} onClose={onClose}>
				<div className="flex flex-col px-3 pt-5 gap-3">
					<Toggle
						enabled={!song.showChordsDisabled}
						label="Show chords"
						onChange={(enabled) => handleAdjustmentMade("showChordsDisabled", !enabled)}
						spacing="between"
					/>

					<Toggle
						enabled={transposing}
						label="Transpose"
						onChange={onToggleTranspose}
						spacing="between"
					/>
					{transposing && hasAnyKeysSet(song) && (
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
						<div className="fixed bottom-0 border-t left-0 w-full px-2 py-3">
							<Button full disabled={!updates} onClick={handleSaveUpdates} loading={saving}>
								Save changes
							</Button>
						</div>
					)}
				</div>
			</Drawer>
		</>
	);
}
