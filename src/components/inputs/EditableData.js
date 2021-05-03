export default function EditableData({ defaultValue, onChange }) {
	return (
		<input
			className="p-1 ml-2 text-sm outline-none focus:outline-none focus:bg-gray-100 hover:bg-gray-100 rounded"
			defaultValue={defaultValue}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
}
