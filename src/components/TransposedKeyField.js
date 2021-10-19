import { getHalfStepHigher, getHalfStepLower } from "../utils/SongUtils";

import Button from "./Button";
import DetailTitle from "./DetailTitle";
import EditableData from "./inputs/EditableData";
import KeyTransposerDialog from "./KeyTransposerDialog";
import MinusIcon from "@heroicons/react/outline/MinusIcon";
import PlusIcon from "@heroicons/react/outline/PlusIcon";
import { useState } from "react";

export default function TransposedKeyField({
	transposedKey,
	originalKey,
	onChange,
	content,
	editable,
}) {
	const [showKeyTransposerDialog, setShowKeyTransposerDialog] = useState(false);

	const handleKeyChange = (newKey) => {
		onChange(newKey);
		setShowKeyTransposerDialog(false);
	};

	const handleTransposeUpHalfKey = () => {
		onChange(getHalfStepHigher(transposedKey || originalKey));
	};

	const handleTransposeDownHalfKey = () => {
		onChange(getHalfStepLower(transposedKey || originalKey));
	};

	return (
		<div className="flex flex-row items-center mb-1">
			<DetailTitle>Transposed:</DetailTitle>
			<EditableData
				value={transposedKey ? transposedKey : ""}
				onChange={() => null}
				placeholder="Click to transpose"
				onClick={() => setShowKeyTransposerDialog(true)}
				editable={editable}
			/>
			<Button size="xs" variant="open" disabled={!originalKey} onClick={handleTransposeUpHalfKey}>
				<PlusIcon className="w-4 h-4" />
			</Button>
			<Button size="xs" variant="open" disabled={!originalKey} onClick={handleTransposeDownHalfKey}>
				<MinusIcon className="w-4 h-4" />
			</Button>
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
