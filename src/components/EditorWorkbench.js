import ChordOptions from "./ChordOptions";
import LyricOptions from "./LyricOptions";
import PageTitle from "./PageTitle";
import { useEffect, useState } from "react";
import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { selectSongBeingEdited, setSongBeingEdited } from "../store/editorSlice";
import SongApi from "../api/SongApi";
import { isEmpty } from "../utils/ObjectUtils";
import Button from "./Button";
import Editor from "./Editor";
import EditorMobileTopNav from "./EditorMobileTopNav";
import EditorDrawer from "./EditorDrawer";

export default function EditorWorkbench() {
	const [showEditorDrawer, setShowEditorDrawer] = useState(false);
	const [formatOptions, setFormatOptions] = useState({});
	const [updatedSong, setUpdatedSong] = useState("");
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
			boldChords: songBeingEdited.boldChords,
			italicChords: songBeingEdited.italicChords,
		};

		setFormatOptions(formatOptions);
		document.title = songBeingEdited.name + " | Editor";
	}, [songBeingEdited]);

	const handleGoBack = () => {
		router.goBack();
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
					content: updatedSong,
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

	const handleContentChange = (newContent) => {
		setUpdatedSong(newContent);
		if (newContent !== songBeingEdited.content) {
			setDirty(true);
		}
	};

	return (
		<>
			<div className="sm:hidden">
				<EditorMobileTopNav
					song={songBeingEdited}
					onShowEditorDrawer={() => setShowEditorDrawer(true)}
				/>
				<EditorDrawer
					formatOptions={formatOptions}
					open={showEditorDrawer}
					onClose={() => setShowEditorDrawer(false)}
					onFormatChange={handleFormatChange}
				/>
				<div className="fixed w-full bottom-0 p-3 z-20">
					<Button full disabled={!dirty} onClick={handleSaveChanges} loading={savingUpdates}>
						Save Changes
					</Button>
				</div>
			</div>
			<div className="hidden sm:block">
				<div className="px-3 container mx-auto flex items-center justify-between">
					<div className="flex items-center">
						<span className="mr-4">
							<Button variant="open" size="xs" onClick={handleGoBack}>
								<ArrowNarrowLeftIcon className="text-gray-600 h-6 w-6" />
							</Button>
						</span>
						<PageTitle title={songBeingEdited.name} />
					</div>
					<span>
						<Button disabled={!dirty} onClick={handleSaveChanges} loading={savingUpdates}>
							Save Changes
						</Button>
					</span>
				</div>
				<div className="bg-gray-50 py-3 px-5 border-t border-gray-200 border-b sticky top-0">
					<LyricOptions
						onAlignmentChange={(newAlignment) => handleFormatChange("alignment", newAlignment)}
						onFontChange={(newFont) => handleFormatChange("font", newFont)}
						onFontSizeChange={(newFontSize) => handleFormatChange("fontSize", newFontSize)}
						formatOptions={formatOptions}
					/>
				</div>
			</div>
			<div className="grid grid-cols-4">
				<div className="col-span-4 sm:col-span-3 container mx-auto px-10 mb-12 sm:mb-0 ">
					<Editor
						content={songBeingEdited.content}
						formatOptions={formatOptions}
						onContentChange={handleContentChange}
					/>
				</div>
				<div className="hidden sm:block col-span-1 border-gray-300 border-l px-3">
					<ChordOptions
						onBoldToggled={(toggleValue) => handleFormatChange("boldChords", toggleValue)}
						onItalicsToggled={(toggleValue) => handleFormatChange("italicChords", toggleValue)}
						formatOptions={formatOptions}
					/>
				</div>
			</div>
		</>
	);
}
