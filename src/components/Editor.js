import ReactQuill from "react-quill";
import { getFormats, toHtmlString } from "../utils/SongUtils";
import { useCallback, useEffect, useRef, useState } from "react";

const FORMATTABLE_KEY_CODE = {
	40: "down arrow",
	38: "up arrow",
	13: "enter",
};

export default function Editor({ content, onContentChange, formatOptions }) {
	const [classes] = useState("my-4");
	const editorRef = useRef();

	const handleFormatSong = useCallback(() => {
		let songInEditor = editorRef.current.getEditor().getText();
		let formats = getFormats(songInEditor, formatOptions);

		formats.forEach((format) => {
			editorRef.current
				.getEditor()
				.formatText(format.start, format.length, format.format, format.value);
		});

		let elements = document.getElementsByClassName("ql-editor");

		elements[0].style.fontFamily = formatOptions.font;
		elements[0].style.fontSize = formatOptions.font_size + "px";
	}, [formatOptions]);

	useEffect(() => {
		handleFormatSong();
	}, [formatOptions, handleFormatSong]);

	const handleContentChange = (e) => {
		if (editorRef?.current) {
			let songInEditor = editorRef.current.getEditor().getText();
			onContentChange(songInEditor);
		}
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
				modules={{ clipboard: { matchVisual: false } }}
			/>
		</div>
	);
}
