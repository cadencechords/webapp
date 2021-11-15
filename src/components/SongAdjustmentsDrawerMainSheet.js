import { EDIT_SONGS, noop } from "../utils/constants";

import AddStickyNoteIcon from "../icons/AddStickyNoteIcon";
import Button from "./Button";
import MobileMenuButton from "./buttons/MobileMenuButton";
import SongApi from "../api/SongApi";
import Toggle from "./Toggle";
import { reportError } from "../utils/error";
import { selectCurrentMember } from "../store/authSlice";
import { selectCurrentSubscription } from "../store/subscriptionSlice";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useState } from "react";

// import ScrollIcon from "../icons/ScrollIcon";

export default function SongAdjustmentsDrawerMainSheet({
	song,
	onFormatChange,
	onSongChange,
	onAddNote,
	onShowAutoScrollSheet,
}) {
	const [updates, setUpdates] = useState();
	const [saving, setSaving] = useState(false);
	const currentMember = useSelector(selectCurrentMember);
	const id = useParams().id;
	const currentSubscription = useSelector(selectCurrentSubscription);
	const iconClasses = "w-5 h-5 mr-3 text-blue-600";

	const handleSaveUpdates = async () => {
		try {
			setSaving(true);
			await SongApi.updateOneById(id, updates);
			setUpdates(null);
		} catch (error) {
			reportError(error);
		} finally {
			setSaving(false);
		}
	};
	return (
		<div className="flex flex-col pt-5">
			<MobileMenuButton
				className="flex-between"
				onClick={() => onFormatChange("chords_hidden", !song.format.chords_hidden)}
			>
				Show chords
				<Toggle enabled={!song.format.chords_hidden} onChange={noop} spacing="between" />
			</MobileMenuButton>

			{currentSubscription.isPro && (
				<MobileMenuButton className="hidden sm:flex sm:items-center" onClick={onAddNote}>
					<AddStickyNoteIcon className={iconClasses} />
					Add a note
				</MobileMenuButton>
			)}
			{/* <MobileMenuButton className="flex items-center" onClick={onShowAutoScrollSheet}>
				<ScrollIcon className={iconClasses} /> Auto scroll
			</MobileMenuButton> */}
			{currentMember.can(EDIT_SONGS) && (
				<div className="fixed bottom-0 border-t left-0 w-full px-2 py-3">
					<Button full disabled={!updates} onClick={handleSaveUpdates} loading={saving}>
						Save changes
					</Button>
				</div>
			)}
		</div>
	);
}
