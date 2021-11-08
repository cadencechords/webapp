import { useEffect, useState } from "react";

import { ADD_FILES } from "../utils/constants";
import FilesApi from "../api/filesApi";
import NoDataMessage from "./NoDataMessage";
import SongFile from "./SongFile";
import SongFileUpload from "./SongFileUpload";
import { reportError } from "../utils/error";
import { selectCurrentMember } from "../store/authSlice";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

export default function SongFilesTab({ onFilesChange, files }) {
	const [loading, setLoading] = useState(false);
	const { id: songId } = useParams();
	const currentMember = useSelector(selectCurrentMember);

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				let { data } = await FilesApi.getFilesForSong(songId);
				onFilesChange(data);
			} catch (error) {
				reportError(error);
			} finally {
				setLoading(false);
			}
		}

		if (!files) {
			fetchData();
		}
	}, [files, songId, onFilesChange]);

	function handleDelete(fileIdToDelete) {
		onFilesChange(files?.filter((file) => file.id !== fileIdToDelete));
	}

	function handleUpdate(updatedFile) {
		onFilesChange(files.map((file) => (file.id === updatedFile.id ? updatedFile : file)));
	}

	return (
		<div>
			{currentMember.can(ADD_FILES) && <SongFileUpload onFilesUploaded={onFilesChange} />}

			{loading || files?.length === 0 ? (
				<NoDataMessage loading={loading} type="files" />
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{files?.map((file) => (
						<SongFile key={file.id} file={file} onDelete={handleDelete} onUpdate={handleUpdate} />
					))}
				</div>
			)}
		</div>
	);
}
