import { useRef, useState } from "react";

import Button from "./Button";
import XIcon from "@heroicons/react/outline/XIcon";

export default function FileInput({ onChange, accept, onRemove }) {
	const input = useRef();
	const [file, setFile] = useState();

	const handleFileChosen = (e) => {
		let uploadedFile = e.target.files[0];
		onChange(uploadedFile);
		setFile(uploadedFile);
	};

	const handleClick = () => {
		input.current.click();
	};

	const handleRemoveChosenFile = () => {
		setFile(null);
		onRemove();
		input.current.value = "";
	};

	return (
		<>
			<input
				className="hidden"
				onChange={handleFileChosen}
				type="file"
				accept={accept}
				ref={input}
			/>
			<Button full onClick={handleClick}>
				Choose file
			</Button>
			{file && (
				<div className="flex-between border rounded-md p-3 mt-4">
					{file.name}
					<Button size="xs" variant="open" onClick={handleRemoveChosenFile}>
						<XIcon className="w-5 h-5 text-gray-500" />
					</Button>
				</div>
			)}
		</>
	);
}

FileInput.defaultProps = {
	accept: "",
};
