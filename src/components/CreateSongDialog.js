import OutlinedInput from "./inputs/OutlinedInput";
import StyledDialog from "./StyledDialog";
import FilledButton from "./buttons/FilledButton";
import { useState } from "react";
import SongApi from "../api/SongApi";

export default function CreateSongDialog({ open, onCloseDialog, onCreate }) {
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);

	const canCreate = Boolean(name);

	const handleCreate = async () => {
		setLoading(true);
		try {
			let result = await SongApi.createOne({ name });
			if (onCreate) {
				onCreate(result.data);
				onCloseDialog();
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<StyledDialog title="Create a new song" open={open} onCloseDialog={onCloseDialog} size="lg">
			<div className="mb-4">
				<div className="mb-2">Name</div>
				<OutlinedInput placeholder="ex: Amazing Grace" value={name} onChange={setName} />
			</div>

			<FilledButton bold full disabled={!canCreate} loading={loading} onClick={handleCreate}>
				Create Song
			</FilledButton>
		</StyledDialog>
	);
}
