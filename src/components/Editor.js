import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { toHtmlString, getFormats } from "../utils/SongUtils";

const FORMATTABLE_KEY_CODE = {
	40: "down arrow",
	38: "up arrow",
	13: "enter",
};

export default function Editor({ content, onContentChange, formatOptions }) {
	const [classes] = useState("my-4");
	const editorRef = useRef();

	useEffect(() => {
		handleFormatSong();
	}, [formatOptions]);

	const handleContentChange = () => {
		if (editorRef?.current) {
			let songInEditor = editorRef.current.getEditor().getText();
			onContentChange(songInEditor);
		}
	};

	const handleFormatSong = () => {
		let songInEditor = editorRef.current.getEditor().getText();
		let formats = getFormats(songInEditor, formatOptions);

		formats.forEach((format) => {
			editorRef.current
				.getEditor()
				.formatText(format.start, format.length, format.format, format.value);
		});

		let elements = document.getElementsByClassName("ql-editor");

		elements[0].style.fontFamily = formatOptions.font;
		elements[0].style.fontSize = formatOptions.fontSize + "px";
	};

	const handleKeyUp = (e) => {
		let keyCode = e.keyCode;
		if (FORMATTABLE_KEY_CODE[keyCode]) {
			handleFormatSong();
		}
	};

	return (
		<div className="overflow-x-auto">
			<ReactQuill
				theme={null}
				defaultValue={toHtmlString(content)}
				ref={editorRef}
				placeholder="Start typing here"
				preserveWhitespace
				onChange={handleContentChange}
				onBlur={handleFormatSong}
				className={classes}
				onKeyUp={handleKeyUp}
			/>
		</div>
	);
}
