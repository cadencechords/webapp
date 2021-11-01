import EditSongFileDialog from "../dialogs/EditSongFileDialog";
import FilesApi from "../api/filesApi";
import SongFileOptionsPopover from "./SongFileOptionsPopover";
import { toKb } from "../utils/numberUtils";
import { useParams } from "react-router";
import { useState } from "react";

export default function SongFile({ file, onDelete, onUpdate }) {
	const { id: songId } = useParams();
	const [showEditDialog, setShowEditDialog] = useState(false);

	function handleDelete() {
		onDelete(file.id);
		FilesApi.deleteSongFile(songId, file.id);
	}

	return (
		<div className="rounded-md border border-gray-300 p-2 flex-between text-sm">
			<div className="ml-2">
				<a
					className="font-medium hover:text-blue-600 block"
					href={file.url}
					target="_blank"
					rel="noreferrer"
				>
					{file?.name}
				</a>
				<div className="text-gray-600 text-xs">{toKb(file.size)} KB</div>
			</div>
			<SongFileOptionsPopover
				onDelete={handleDelete}
				onEdit={() => setShowEditDialog(true)}
				file={file}
			/>
			<EditSongFileDialog
				open={showEditDialog}
				onCloseDialog={() => setShowEditDialog(false)}
				file={file}
				onUpdated={onUpdate}
			/>
		</div>
	);
}
