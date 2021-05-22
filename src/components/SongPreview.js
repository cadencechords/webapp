export default function SongPreview({ song }) {
	let formatStyles = { fontFamily: song.font, fontSize: song.font_size };
	return (
		<div
			className="rounded-md whitespace-pre resize-none shadow-md p-4 border border-gray-300"
			style={formatStyles}
		>
			{song.content}
		</div>
	);
}
