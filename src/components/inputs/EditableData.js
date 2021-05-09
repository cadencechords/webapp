export default function EditableData({ value, onChange, placeholder }) {
	return (
		<input
			className="p-1 ml-2 w-full text-sm outline-none focus:outline-none focus:bg-gray-100 hover:bg-gray-100 rounded"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
		/>
	);
}
