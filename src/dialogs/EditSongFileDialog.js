import { basename, extension } from "../utils/StringUtils";

import Button from "../components/Button";
import FilesApi from "../api/filesApi";
import OutlinedInput from "../components/inputs/OutlinedInput";
import StyledDialog from "../components/StyledDialog";
import { useParams } from "react-router";
import { useState } from "react";

export default function EditSongFileDialog({ open, onCloseDialog, file, onUpdated }) {
	const [name, setName] = useState(basename(file.name));
	const [loading, setLoading] = useState(false);
	const [dirty, setDirty] = useState(false);
	const { id: songId } = useParams();

	function handleNameChange(updatedName) {
		setDirty(true);
		setName(updatedName);
	}

	async function handleSave() {
		try {
			setLoading(true);
			await FilesApi.updateSongFile(songId, file.id, { name });
			onUpdated({ ...file, name: `${name}.${extension(file.name)}` });
			handleClose();
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	}

	function handleClose() {
		setLoading(false);
		onCloseDialog();
	}

	return (
		<StyledDialog open={open} onCloseDialog={handleClose} title={file?.name} borderedTop={false}>
			<OutlinedInput
				value={name || ""}
				onChange={handleNameChange}
				className="mb-4"
				onEnter={handleSave}
				label="File name"
			/>
			<Button full disabled={!dirty} onClick={handleSave} loading={loading}>
				Save changes
			</Button>
		</StyledDialog>
	);
}
