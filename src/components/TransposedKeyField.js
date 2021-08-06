import { useState } from "react";
import DetailTitle from "./DetailTitle";
import EditableData from "./inputs/EditableData";
import KeyTransposerDialog from "./KeyTransposerDialog";

export default function TransposedKeyField({ transposedKey, originalKey, onChange, content }) {
	const [showKeyTransposerDialog, setShowKeyTransposerDialog] = useState(false);

	const handleKeyChange = (newKey) => {
		onChange(newKey);
		setShowKeyTransposerDialog(false);
	};

	return (
		<div className="flex flex-row items-center mb-1">
			<DetailTitle>Transposed:</DetailTitle>
			<EditableData
				value={transposedKey ? transposedKey : ""}
				onChange={() => null}
				placeholder="Click to transpose"
				onClick={() => setShowKeyTransposerDialog(true)}
			/>

			<KeyTransposerDialog
				open={showKeyTransposerDialog}
				onCloseDialog={() => setShowKeyTransposerDialog(false)}
				originalKey={originalKey}
				transposedKey={transposedKey}
				onChange={handleKeyChange}
				content={content}
			/>
		</div>
	);
}
