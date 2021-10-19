import { selectSongBeingEdited, updateSongContent } from "../store/editorSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import Button from "../components/Button";
import Editor from "../components/Editor";
import EditorDrawer from "../components/EditorDrawer";
import EditorMobileTopNav from "../components/EditorMobileTopNav";
import EditorOptionsBar from "../components/EditorOptionsBar";
import EyeIcon from "@heroicons/react/outline/EyeIcon";
import FormatApi from "../api/FormatApi";
import PageTitle from "../components/PageTitle";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import SongApi from "../api/SongApi";
import { html } from "../utils/SongUtils";
import { isEmpty } from "../utils/ObjectUtils";
import { useHistory } from "react-router";

export default function EditorWorkbenchPage() {
	const songBeingEdited = useSelector(selectSongBeingEdited);
	const [showEditorDrawer, setShowEditorDrawer] = useState(false);
	const [format, setFormat] = useState({});
	const [savingUpdates, setSavingUpdates] = useState(false);
	const [dirty, setDirty] = useState(false);
	const [showEditor, setShowEditor] = useState(true);

	const [changes, setChanges] = useState({ content: null, format: {} });

	const router = useHistory();
	const dispatch = useDispatch();

	console.log(songBeingEdited);

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
				dispatch(updateSongContent(changes.content));
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
		setChanges((currentChanges) => ({ ...currentChanges, content: newContent }));
		setDirty(true);
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
					<EditorOptionsBar formatOptions={format} onFormatChange={handleFormatChange} />
				</div>
			</div>
			<div className="hidden 2xl:grid grid-cols-2 ">
				<div className="col-span-2 2xl:col-span-1 container mx-auto px-5 mb-12 sm:mb-0 border-r">
					<Editor
						content={changes.content ? changes.content : songBeingEdited.content}
						formatOptions={format}
						onContentChange={handleContentChange}
					/>
				</div>
				<div className="px-5 my-3 hidden 2xl:block">
					<PageTitle title="Preview" className="mb-4" />
					{html({ content: changes.content || songBeingEdited.content, format: format })}
				</div>
			</div>
			<div className="2xl:hidden px-2 md:px-10 mb-28 ">
				{showEditor ? (
					<Editor
						content={changes.content ? changes.content : songBeingEdited.content}
						formatOptions={format}
						onContentChange={handleContentChange}
					/>
				) : (
					<div>
						<PageTitle title="Preview" className="my-4" />
						{html({ content: changes.content || songBeingEdited.content, format: format })}
					</div>
				)}
				{showEditor ? (
					<Button
						onClick={() => setShowEditor(false)}
						variant="open"
						className="fixed bottom-16 right-4 sm:bottom-7 sm:right-7"
					>
						<EyeIcon className="h-6 w-6" />
					</Button>
				) : (
					<Button
						onClick={() => setShowEditor(true)}
						variant="open"
						className="fixed bottom-16 right-4 sm:bottom-7 sm:right-7"
					>
						<PencilIcon className="h-6 w-6" />
					</Button>
				)}
			</div>
		</>
	);
}
