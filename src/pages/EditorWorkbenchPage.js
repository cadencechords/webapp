import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import { useEffect, useState } from "react";

import ChordOptions from "../components/ChordOptions";
import LyricOptions from "../components/LyricOptions";
import PageTitle from "../components/PageTitle";
import { selectSongBeingEdited } from "../store/editorSlice";
import { isEmpty } from "../utils/ObjectUtils";
import Button from "../components/Button";
import Editor from "../components/Editor";
import EditorMobileTopNav from "../components/EditorMobileTopNav";
import EditorDrawer from "../components/EditorDrawer";
import SongApi from "../api/SongApi";
import FormatApi from "../api/FormatApi";

export default function EditorWorkbenchPage() {
	const songBeingEdited = useSelector(selectSongBeingEdited);
	const [showEditorDrawer, setShowEditorDrawer] = useState(false);
	const [format, setFormat] = useState({});
	const [savingUpdates, setSavingUpdates] = useState(false);
	const [dirty, setDirty] = useState(false);

	const [changes, setChanges] = useState({ content: null, format: {} });

	const router = useHistory();

	if (!songBeingEdited || isEmpty(songBeingEdited)) {
		router.push("/");
	}

	useEffect(() => {
		let format = songBeingEdited.format;
		setFormat(format);
		document.title = songBeingEdited.name + " | Editor";
	}, [songBeingEdited]);

	const handleGoBack = () => {
		router.goBack();
	};

	const handleFormatChange = (formatOption, value) => {
		setDirty(true);
		let formatOptionsCopy = { ...format };
		formatOptionsCopy[formatOption] = value;
		setFormat(formatOptionsCopy);
		setChanges((currentChanges) => ({
			...currentChanges,
			format: { ...currentChanges.format, [formatOption]: value },
		}));
	};

	const handleSaveChanges = async () => {
		try {
			if (changes.content) {
				setSavingUpdates(true);
				await SongApi.updateOneById(songBeingEdited.id, {
					content: changes.content,
				});
			}

			if (!isEmpty(changes.format)) {
				setSavingUpdates(true);
				if (format.id) {
					await FormatApi.updateOneById(format.id, changes.format);
				} else {
					let newFormat = { ...changes.format };
					newFormat.song_id = songBeingEdited.id;
					await FormatApi.createOne(newFormat);
				}
			}
		} catch (error) {
			console.log(error);
		} finally {
			setSavingUpdates(false);
			setDirty(false);
			setChanges({ content: null, format: {} });
		}
	};

	const handleContentChange = (newContent) => {
		if (newContent !== songBeingEdited.content) {
			setChanges((currentChanges) => ({ ...currentChanges, content: newContent }));
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
					formatOptions={format}
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
				<div className="px-3 container mx-auto flex-between">
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
						onFontSizeChange={(newFontSize) => handleFormatChange("font_size", newFontSize)}
						formatOptions={format}
					/>
				</div>
			</div>
			<div className="grid grid-cols-4">
				<div className="col-span-4 sm:col-span-3 container mx-auto px-10 mb-12 sm:mb-0 ">
					<Editor
						content={songBeingEdited.content}
						formatOptions={format}
						onContentChange={handleContentChange}
					/>
				</div>
				<div className="hidden sm:block col-span-1 border-gray-300 border-l px-3">
					<ChordOptions
						onBoldToggled={(toggleValue) => handleFormatChange("bold_chords", toggleValue)}
						onItalicsToggled={(toggleValue) => handleFormatChange("italic_chords", toggleValue)}
						formatOptions={format}
					/>
				</div>
			</div>
		</>
	);
}
