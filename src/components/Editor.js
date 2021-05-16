import FilledButton from "./buttons/FilledButton";
import ChordOptions from "./ChordOptions";
import LyricOptions from "./LyricOptions";
import PageTitle from "./PageTitle";
import { useState } from "react";
import OpenButton from "./buttons/OpenButton";
import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import { useHistory } from "react-router";
import { isChordLine, format } from "../utils/SongUtils";
import ButtonSwitch from "./buttons/ButtonSwitch";

export default function Editor() {
	const [editorView, setEditorView] = useState("Edit");
	const [formatOptions, setFormatOptions] = useState({});
	const router = useHistory();
	const [chordsBold, setChordsBold] = useState(false);
	const [numLines, setNumLines] = useState(100);
	const [formattedSong, setFormattedSong] = useState("");
	const [unformattedSong, setUnformattedSong] = useState("");

	const handleGoBack = () => {
		router.goBack();
	};

	const handleChange = (value) => {
		setUnformattedSong(value);
		setNumLines(value.split(/\r\n|\r|\n/).length + 1);
	};

	const formatSong = () => {
		return format(unformattedSong, formatOptions);
	};

	const handleFormatChange = (formatOption, value) => {
		let formatOptionsCopy = { ...formatOptions };
		formatOptionsCopy[formatOption] = value;
		setFormatOptions(formatOptionsCopy);
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
					<FilledButton>Save Changes</FilledButton>
				</span>
			</div>
			<div className="bg-gray-100 py-3 px-5 border-t border-gray-200 border-b">
				<LyricOptions
					onAlignmentChange={(newAlignment) => handleFormatChange("alignment", newAlignment)}
				/>
			</div>
			<div className="grid grid-cols-4">
				<div className="col-span-3 container mx-auto px-10">
					<div className="flex justify-center mt-2 mb-4">
						<ButtonSwitch
							buttonLabels={["Edit", "Format"]}
							activeButtonLabel={editorView}
							onClick={setEditorView}
						/>
					</div>
					{editorView === "Edit" ? (
						<textarea
							onChange={(e) => handleChange(e.target.value)}
							rows={numLines}
							value={unformattedSong}
							className="w-full outline-none focus:outline-none text-base resize-none font-mono"
							style={{ fontFamily: "monospace" }}
							placeholder="Start typing here"
						/>
					) : (
						formatSong()
					)}
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
