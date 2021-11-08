import { useRef, useState } from "react";

import BarLoader from "react-spinners/BarLoader";
import Button from "./Button";
import DocumentAddIcon from "@heroicons/react/outline/DocumentAddIcon";
import FilesApi from "../api/filesApi";
import { reportError } from "../utils/error";
import { useParams } from "react-router";

export default function SongFileUpload({ onFilesUploaded }) {
	const [filesBeingUploaded, setFilesBeingUploaded] = useState([]);
	const inputRef = useRef();
	const { id } = useParams();

	async function handleFilesSelected(e) {
		let files = Object.values(e.target.files);
		setFilesBeingUploaded(files);
		try {
			let { data } = await FilesApi.addFilesToSong(id, files);
			setFilesBeingUploaded([]);
			onFilesUploaded?.(data);
		} catch (error) {
			reportError(error);
		}
	}

	return (
		<>
			<div className="flex justify-end mb-4">
				<Button
					variant="open"
					color="black"
					className="flex-center"
					onClick={() => inputRef.current.click()}
				>
					<DocumentAddIcon className="w-4 h-4 text-blue-600 mr-2" /> Add file
				</Button>
				<input type="file" hidden ref={inputRef} onChange={handleFilesSelected} multiple />
			</div>
			<div
				className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${
					filesBeingUploaded?.length > 0 ? "mb-4" : ""
				}`}
			>
				{filesBeingUploaded?.map((file, index) => (
					<div key={index} className="border border-gray-300 rounded-md relative px-3 pt-2.5 pb-2">
						<BarLoader
							width="100%"
							color="#2563eb"
							css={
								"display: inline-block; position: absolute; left: 0; top: 0; right: 0; border-top-left-radius: 4px;  border-top-right-radius: 4px"
							}
						/>
						{file.name}
					</div>
				))}
			</div>
		</>
	);
}
