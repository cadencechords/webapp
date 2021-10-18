import { countLines } from "../utils/songUtils";

export default function Editor({ content, onContentChange, formatOptions }) {
	const styles = { fontFamily: formatOptions.font, fontSize: `${formatOptions.font_size}px` };

	return (
		<div className="overflow-x-auto overflow-y-hidden">
			<textarea
				className="w-full resize-none outline-none focus:outline-none my-3 overflow-y-hidden"
				value={content}
				onChange={(e) => onContentChange(e.target.value)}
				style={styles}
				rows={countLines(content) + 3}
				placeholder="Type your song here"
			></textarea>
		</div>
	);
}
