import { useDispatch, useSelector } from "react-redux";

import Drawer from "./Drawer";
import { EDIT_SONGS } from "../utils/constants";
import MobileMenuButton from "./buttons/MobileMenuButton";
import PencilIcon from "@heroicons/react/solid/PencilIcon";
import Toggle from "./Toggle";
import { noop } from "lodash";
import { selectCurrentMember } from "../store/authSlice";
import { setSongBeingEdited } from "../store/editorSlice";
import { useHistory } from "react-router-dom";

export default function SetlistAdjustmentsDrawer({ song, onSongUpdate, open, onClose }) {
	const currentMember = useSelector(selectCurrentMember);
	const dispatch = useDispatch();
	const router = useHistory();

	const iconClasses = "w-5 h-5 mr-3 text-blue-600";

	function handleOpenInEditor() {
		dispatch(setSongBeingEdited(song));
		router.push("/editor");
	}

	function handleFormatUpdate(field, value) {
		let updatedFormat = { ...song.format, [field]: value };
		onSongUpdate("format", updatedFormat);
	}

	return (
		<Drawer open={open} onClose={onClose}>
			<div className="pt-8">
				{/* <div className="flex-between mb-2">
					<div className="text-base font-semibold">Resize lyrics</div>
					<Toggle
						enabled={song?.format?.autosize}
						onChange={(newValue) => onFormatUpdate("autosize", newValue)}
					/>
				</div> */}
				<MobileMenuButton
					full
					className="flex-between"
					onClick={() => handleFormatUpdate("chords_hidden", !song?.format?.chords_hidden)}
				>
					Show chords
					<Toggle enabled={!song?.format?.chords_hidden} onChange={noop} spacing="between" />
				</MobileMenuButton>

				{currentMember.can(EDIT_SONGS) && (
					<>
						<MobileMenuButton full className="flex items-center" onClick={handleOpenInEditor}>
							<PencilIcon className={iconClasses} />
							Edit
						</MobileMenuButton>
					</>
				)}
			</div>
		</Drawer>
	);
}
