export default function EditableData({ value, onChange, placeholder, centered }) {
	return (
		<input
			className={
				`p-1 w-full text-sm outline-none focus:outline-none ` +
				` focus:bg-gray-100 hover:bg-gray-100 rounded bg-transparent transition-colors ` +
				` ${centered ? " text-center " : ""}`
			}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
		/>
	);
}

EditableData.defaultProps = {
	centered: false,
};
