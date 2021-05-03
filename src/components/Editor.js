import FilledButton from "./buttons/FilledButton";
import ChordOptions from "./ChordOptions";
import LyricOptions from "./LyricOptions";
import PageTitle from "./PageTitle";
import { useRef, useState } from "react";
import OpenButton from "./buttons/OpenButton";
import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import { useHistory } from "react-router";
import { isChordLine } from "../utils/SongUtils";

export default function Editor() {
	const editorRef = useRef(null);
	const [alignment, setAlignment] = useState("left");
	const router = useHistory();
	const [chordsBold, setChordsBold] = useState(false);

	const handleGoBack = () => {
		router.goBack();
	};

	const handleSave = () => {
		let editorContents = document.getElementById("editor");
		editorContents.style["font-family"] = "monospace";
		let songLines = editorContents.children;

		for (let i = 0; i < songLines.length; ++i) {
			let line = songLines[i];
			if (line.tagName === "DIV") {
				if (isChordLine(line.textContent)) {
					line.style["font-weight"] = `${chordsBold ? "600" : "500"}`;
				}
			}
		}
	};

	return (
		<>
			<div className="px-3 container mx-auto flex items-center justify-between">
				<div className="flex items-center">
					<span className="mr-4">
						<OpenButton onClick={handleGoBack}>
							<ArrowNarrowLeftIcon className="text-gray-600 h-6 w-6" />
						</OpenButton>
					</span>
					<PageTitle title="Amazing Grace" />
				</div>
				<span>
					<FilledButton onClick={handleSave}>Save Changes</FilledButton>
				</span>
			</div>
			<div className="bg-gray-100 py-3 px-5 border-t border-gray-200 border-b">
				<LyricOptions
					onAlignmentChange={(newAlignment) => setAlignment(newAlignment)}
				/>
			</div>
			<div className="grid grid-cols-4">
				<div
					contentEditable
					className="col-span-3 container font-mono px-12 py-10 mx-auto focus:outline-none outline-none"
					onChange={(event) => console.log(event)}
					ref={editorRef}
					id="editor"
				>
					<div
						style={{ textAlign: `${alignment}`, fontFamily: "monospace" }}
						className="font-mono"
					>
						Content
					</div>
				</div>
				<div className="col-span-1 border-gray-300 border-l px-3">
					<ChordOptions
						onBoldToggled={(toggleValue) => setChordsBold(toggleValue)}
						options={{ bold: chordsBold }}
					/>
				</div>
			</div>
		</>
	);
}
