import { getHalfStepHigher, getHalfStepLower } from "../utils/music";
import { useEffect, useState } from "react";

import Button from "./Button";
import { EDIT_SONGS } from "../utils/constants";
import MinusIcon from "@heroicons/react/outline/MinusIcon";
import OrDivider from "./OrDivider";
import PlusIcon from "@heroicons/react/outline/PlusIcon";
import SectionTitle from "./SectionTitle";
import SongApi from "../api/SongApi";
import Toggle from "./Toggle";
import TransposeOptions from "./TransposeOptions";
import { hasAnyKeysSet } from "../utils/SongUtils";
import { reportError } from "../utils/error";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";

export default function TransposeSheet({ song, onSongChange, className }) {
	const [saving, setSaving] = useState(false);
	const [updates, setUpdates] = useState();
	const currentMember = useSelector(selectCurrentMember);

	useEffect(() => {
		setUpdates(null);
	}, [song.id]);

	function handleTransposeUpHalfStep() {
		let halfStepHigher = getHalfStepHigher(song.transposed_key || song.original_key);
		setUpdates({ transposed_key: halfStepHigher });
		onSongChange("transposed_key", halfStepHigher);
	}

	function handleTransposeDownHalfStep() {
		let halfStepLower = getHalfStepLower(song.transposed_key || song.original_key);
		setUpdates({ transposed_key: halfStepLower });
		onSongChange("transposed_key", halfStepLower);
	}

	function handleTranspose(keyToTransposeTo) {
		setUpdates({ transposed_key: keyToTransposeTo });
		onSongChange("transposed_key", keyToTransposeTo);
	}

	async function handleSaveUpdates() {
		try {
			setSaving(true);
			await SongApi.updateOneById(song.id, updates);
			setUpdates(null);
		} catch (error) {
			reportError(error);
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className={className}>
			<SectionTitle
				title={
					<>
						Transpose
						<Toggle
							enabled={song.show_transposed}
							onChange={(value) => onSongChange("show_transposed", value)}
						/>
						{currentMember?.can(EDIT_SONGS) && updates && song.show_transposed && (
							<Button
								size="xs"
								className="ml-4"
								variant="open"
								onClick={handleSaveUpdates}
								loading={saving}
							>
								Save changes
							</Button>
						)}
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
					<TransposeOptions song={song} onKeyChange={handleTranspose} />
				</div>
			)}
		</div>
	);
}

TransposeSheet.defaultProps = {
	className: "",
};
