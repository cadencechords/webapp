import { useState } from "react";
import DetailTitle from "./DetailTitle";
import EditableData from "./inputs/EditableData";
import KeyChooserDialog from "./KeyChooserDialog";

export default function SongKeyField({ songKey, onChange }) {
	const [showKeyChooserDialog, setShowKeyChooserDialog] = useState(false);

	const handleKeyChange = (newKey) => {
		onChange(newKey);
		setShowKeyChooserDialog(false);
	};

	return (
		<div className="flex flex-row items-center mb-1">
			<DetailTitle>Key:</DetailTitle>
			<EditableData
				value={songKey ? songKey : ""}
				onChange={() => null}
				placeholder="Add the key"
				onClick={() => setShowKeyChooserDialog(true)}
			/>

			<KeyChooserDialog
				open={showKeyChooserDialog}
				onCloseDialog={() => setShowKeyChooserDialog(false)}
				currentSongKey={songKey}
				onChange={handleKeyChange}
			/>
		</div>
	);
}
