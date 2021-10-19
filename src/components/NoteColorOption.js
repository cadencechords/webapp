export default function NoteColorOption({ color, selected, onClick }) {
	return (
		<button
			className={
				`outline-none focus:outline-none h-10 w-10 mr-6 shadow-sm ${color} ` +
				`${selected ? "ring-offset-2 ring-blue-300 ring-2" : ""}`
			}
			onClick={() => onClick(color)}
		></button>
	);
}
