import { useRef, useState } from "react";

import Button from "./Button";
import TrashIcon from "@heroicons/react/outline/TrashIcon";

export default function FilesInput({ onChange, onRemove, accept, buttonText }) {
	const input = useRef();
	const [files, setFiles] = useState([]);

	function handleFilesChosen(e) {
		let filesArray = Object.values(e.target.files);
		setFiles(filesArray);
		onChange(filesArray);
	}

	function handleRemove(fileToRemove) {
		setFiles((currentFiles) => {
			let updatedFilesList = currentFiles?.filter((file) => file !== fileToRemove);

			if (updatedFilesList?.length === 0) input.current.value = "";

			return updatedFilesList;
		});

		onRemove(fileToRemove);
	}

	return (
		<div>
			<input accept={accept} multiple ref={input} type="file" hidden onChange={handleFilesChosen} />
			{files?.length === 0 && (
				<Button full onClick={() => input.current.click()}>
					{buttonText}
				</Button>
			)}
			<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 my-8">
				{files.map((file, index) => (
					<div key={index} className="p-3 border rounded-md flex-between text-sm">
						{file.name}
						<Button variant="open" size="xs" className="ml-3" onClick={() => handleRemove(file)}>
							<TrashIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
						</Button>
					</div>
				))}
			</div>
		</div>
	);
}
