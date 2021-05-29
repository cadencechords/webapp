import FilledButton from "./buttons/FilledButton";
import ChordOptions from "./ChordOptions";
import LyricOptions from "./LyricOptions";
import PageTitle from "./PageTitle";
import { useEffect, useState } from "react";
import OpenButton from "./buttons/OpenButton";
import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import { useHistory } from "react-router";
import ButtonSwitch from "./buttons/ButtonSwitch";
import FormattedSong from "./FormattedSong";
import { useSelector } from "react-redux";
import { selectSongBeingEdited, setSongBeingEdited } from "../store/editorSlice";
import SongApi from "../api/SongApi";
import { isEmpty } from "../utils/ObjectUtils";

export default function Editor() {
	const [editorView, setEditorView] = useState("Edit");
	const [formatOptions, setFormatOptions] = useState({});
	const [numLines, setNumLines] = useState(30);
	const [unformattedSong, setUnformattedSong] = useState("");
	const [savingUpdates, setSavingUpdates] = useState(false);
	const songBeingEdited = useSelector(selectSongBeingEdited);
	const [dirty, setDirty] = useState(false);
	const router = useHistory();

	if (!songBeingEdited || isEmpty(songBeingEdited)) {
		router.push("/app");
	}

	useEffect(() => {
		let formatOptions = {
			font: songBeingEdited.font,
			fontSize: songBeingEdited.fontSize,
		};

		setFormatOptions(formatOptions);
		setUnformattedSong(songBeingEdited.content ? songBeingEdited.content : "");
	}, [songBeingEdited]);

	const handleGoBack = () => {
		router.goBack();
	};

	const handleChange = (value) => {
		setDirty(true);
		setUnformattedSong(value);
		setNumLines(value.split(/\r\n|\r|\n/).length + 1);
	};

	const handleFormatChange = (formatOption, value) => {
		setDirty(true);
		let formatOptionsCopy = { ...formatOptions };
		formatOptionsCopy[formatOption] = value;
		setFormatOptions(formatOptionsCopy);
	};

	const handleSaveChanges = async () => {
		setSavingUpdates(true);
		try {
			if (songBeingEdited?.id) {
				let { data } = await SongApi.updateOneById(songBeingEdited.id, {
					...formatOptions,
					content: unformattedSong,
				});
				setSongBeingEdited(data);
				setDirty(false);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setSavingUpdates(false);
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
					<PageTitle title={songBeingEdited.name} />
				</div>
				<span>
					<FilledButton disabled={!dirty} onClick={handleSaveChanges} loading={savingUpdates}>
						Save Changes
					</FilledButton>
				</span>
			</div>
			<div className="bg-gray-100 py-3 px-5 border-t border-gray-200 border-b sticky top-0">
				<LyricOptions
					onAlignmentChange={(newAlignment) => handleFormatChange("alignment", newAlignment)}
					onFontChange={(newFont) => handleFormatChange("font", newFont)}
					onFontSizeChange={(newFontSize) => handleFormatChange("fontSize", newFontSize)}
					formatOptions={formatOptions}
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
							style={{ fontFamily: formatOptions.font, fontSize: formatOptions.fontSize + "px" }}
							placeholder="Start typing here"
						/>
					) : (
						<FormattedSong song={unformattedSong} formatOptions={formatOptions} />
					)}
				</div>
				<div className="col-span-1 border-gray-300 border-l px-3">
					<ChordOptions
						onBoldToggled={(toggleValue) => handleFormatChange("boldChords", toggleValue)}
						formatOptions={formatOptions}
					/>
				</div>
			</div>
		</>
	);
}
